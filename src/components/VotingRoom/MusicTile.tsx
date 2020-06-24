import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native'
import { useApolloClient } from "@apollo/react-hooks";
import { SpotifySong, Song, Playlist, Album, Artist, Image } from "../../types";
import { useQuery } from '@apollo/react-hooks'
import WithQueueSong from "../../HOCs/WithQueueSong"
import { getUniqueId } from 'react-native-device-info';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { GET_ADDED_SONG_IDS } from "../../graphql/queries"
import { color } from "react-native-reanimated";
import colors from "../../assets/colors";
import { textStyles } from "../../assets/typography";

export enum TILE_TYPES {
  TRACK = "track",
  PLAYLIST = "playlist",
  ARTIST = "artist",
  ALBUM = "album",
  ADDED_TRACK = "addedTrack"
}

export interface Props {
  data: SpotifySong | Playlist | Album | Artist;
  large: boolean;
  roomId: string;
  score?: number;
  voters?: string[];
  tileType: TILE_TYPES;
  queueSong: Function;
}

interface TileProps {
  clickEvent: Function;
  body: any;
  mainText: string;
  subText: string;
  imageURL: string;
  type: TILE_TYPES;
}

const DEFAULT_BACKGROUND_SOURCE_IMAGE = 'https://tr.rbxcdn.com/722e50adb353073b1e7c665e89d3423b/420/420/Decal/Png'

//TODO: REFACTOR INTO A CONTAINER COMPONENT, ONE FOR RECS THE OTHER FOR ADDED SONGS
const MusicTile = ({ data, large, roomId, score, tileType, voters, queueSong }: Props) => {
  const navigation = useNavigation()
  const fadeAnim = new Animated.Value(0)
  const [clicked, setClicked] = useState(false)
  const { data: addedSongIds } = useQuery(GET_ADDED_SONG_IDS)

  const [tile, setTile] = useState<TileProps>({
    clickEvent: () => {},
    imageURL: DEFAULT_BACKGROUND_SOURCE_IMAGE,
    body: 0,
    mainText: "",
    subText: "",
    type: TILE_TYPES.TRACK
  })

  const upvote = () => {
    const songRef = firestore()
      .doc(`rooms/${roomId}/songs/${data.id}`)
    songRef.update({
      score: firestore.FieldValue.increment(1),
      voters: firestore.FieldValue.arrayUnion(getUniqueId())
    })
  }

  const downvote = () => {
    const songRef = firestore()
      .doc(`rooms/${roomId}/songs/${data.id}`)
    songRef.update({
      score: firestore.FieldValue.increment(-1),
      voters: firestore.FieldValue.arrayRemove(getUniqueId())
    })
  }

  const expandModal = ({ mainText, subText, imageURL, type }: TileProps) => {
    // expand modal to songs in the playlist, artist, or album
    navigation.navigate("ExpandedModal", {
      roomId,
      href: data.href,
      id: data.id,
      primaryLabel: mainText,
      secondaryLabel: subText,
      image: imageURL,
      type,
      album: type === TILE_TYPES.ALBUM ? data : { images: { height: null, width: null, url: null } }
    })
  }

  const animateRender = () => {
    Animated.timing(fadeAnim, {
      useNativeDriver: true,
      toValue: 1,
      duration: 250
    }).start();
  }

  useEffect(() => {
    if (addedSongIds) {
      if (addedSongIds.songs.includes(data.id)) {
        setClicked(true)
      }
      else {
        setClicked(false)
      }
    }
  }, [addedSongIds])

  useEffect(() => {
    const getOptimalImage = (arrOfImages: Image[]) => {
      if (arrOfImages.length === 0) return DEFAULT_BACKGROUND_SOURCE_IMAGE
      if (arrOfImages.length >= 2) {
        return arrOfImages.slice(-2)[0]?.url
      }
      return arrOfImages.slice(-1)[0]?.url
    }
    switch (tileType) {
      case (TILE_TYPES.ADDED_TRACK):
        const clicked = voters && voters.includes(getUniqueId())
        setClicked(clicked ? true : false)
        data = data as SpotifySong
        setTile({
          clickEvent: ({ clicked }: { clicked: boolean }) => clicked ? downvote() : upvote(),
          body: (score || 0),
          mainText: data.name,
          subText: data.artists[0].name,
          imageURL: getOptimalImage(data.album.images),
          type: TILE_TYPES.ADDED_TRACK
        })
        break
      case (TILE_TYPES.TRACK):
        data = data as SpotifySong
        setTile({
          clickEvent: ({ clicked }: { clicked: boolean }) => queueSong(data, roomId, clicked),
          body: undefined,
          mainText: data.name,
          subText: data.artists[0].name,
          imageURL: getOptimalImage(data.album.images),
          type: TILE_TYPES.TRACK
        })
        break
      case (TILE_TYPES.ALBUM):
        const album = data as Album
        setTile({
          clickEvent: expandModal,
          body: undefined,
          mainText: album.name,
          subText: album.artists[0].name,
          imageURL: getOptimalImage(album.images),
          type: TILE_TYPES.ALBUM
        })
        break
      case (TILE_TYPES.PLAYLIST):
        const playlist = data as Playlist
        setTile({
          clickEvent: expandModal,
          body: undefined,
          mainText: playlist.name,
          subText: playlist.owner.display_name,
          imageURL: getOptimalImage(playlist.images),
          type: TILE_TYPES.PLAYLIST
        })
        break
      case (TILE_TYPES.ARTIST):
        const artist = data as Artist
        setTile({
          clickEvent: expandModal,
          body: undefined,
          mainText: artist.name,
          subText: artist.genres ? artist.genres[0] : "",
          imageURL: getOptimalImage(artist.images!),
          type: TILE_TYPES.ARTIST
        })
        break
      default:
        throw ("unrecognized tile type!")
    }
  }, [data, clicked])

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity
        onPress={() => tile.clickEvent({ ...tile, clicked })}
        disabled={!TILE_TYPES.ADDED_TRACK && clicked}
        style={[
          (tileType === TILE_TYPES.TRACK || tileType === TILE_TYPES.ADDED_TRACK) ? styles.buttonSizeSmall : styles.buttonSizeMed,
          styles.button,
          clicked ? styles.clickedOpacity : styles.nonClickedOpacity,
        ]}
      >
        <ImageBackground
          source={{ uri: tile.imageURL }}
          style={styles.musicTileBackground}
          onLoad={animateRender}
        >
          <View style={styles.textContainer}>
            <Text style={[textStyles.h2, styles.bodyText]}>
              {tile.body ? tile.body : ' '}
            </Text>
            <Text style={[textStyles.p, styles.mainText]} numberOfLines={1}>
              {tile.mainText}
            </Text>
            <Text style={[textStyles.p, styles.subText]} numberOfLines={1}>
              {tile.subText}
            </Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </Animated.View>
  )
};

const SPACING_MARGIN = 2.5

const musicTileSizeSmall = Math.round(Dimensions.get('window').width / 3) - SPACING_MARGIN * 2;
const musicTileSizeMed = Math.round(Dimensions.get('window').width / 2) - SPACING_MARGIN * 2;

const styles = StyleSheet.create({
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1
  },
  clickedOpacity: {
    opacity: 0.2
  },
  nonClickedOpacity: {
    opacity: 1
  },
  musicTileBackground: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: "cover",
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  button: {
    borderRadius: 15,
    overflow: "hidden",
    margin: SPACING_MARGIN
  },
  buttonSizeSmall: {
    width: musicTileSizeSmall,
    height: musicTileSizeSmall
  },
  buttonSizeMed: {
    width: musicTileSizeMed,
    height: musicTileSizeMed
  },
  bodyText: {
    color: colors.green,
    zIndex: 1,
    marginBottom: 8,
    fontSize: 26,
    textAlign: 'center'
  },
  textContainer: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    flex: 1,
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    paddingBottom: 12.5,
    paddingHorizontal: 7.5
  },
  mainText: {
    textAlign: 'center',
    color: colors.white,
    zIndex: 1,
    // whiteSpace: 'nowrap',
    overflow: 'hidden',
    margin: 0,
    padding: 0,
    // textOverflow: 'ellipsis'
  },
  subText: {
    textAlign: 'center',
    color: colors.offWhite,
    overflow: 'hidden',
    margin: 0,
    padding: 0,
  }
})



export default WithQueueSong(MusicTile)