import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native'
import { useApolloClient } from "@apollo/react-hooks";
import { SpotifySong, Song, Playlist, Album, Artist, Image } from "../../types";
import { useQuery } from '@apollo/react-hooks'
import WithQueueSong from "../../HOCs/WithQueueSong"
import { getUniqueId } from 'react-native-device-info';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { GET_ADDED_SONG_IDS } from "../../graphql/queries"

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


//TODO: REFACTOR INTO A CONTAINER COMPONENT, ONE FOR RECS THE OTHER FOR ADDED SONGS
const MusicTile = ({ data, large, roomId, score, tileType, voters, queueSong }: Props) => {
  const navigation = useNavigation()
  const [clicked, setClicked] = useState(false)
  const { data: addedSongIds } = useQuery(GET_ADDED_SONG_IDS)
  const [tile, setTile] = useState<TileProps>({
    clickEvent: () => { },
    imageURL: "",
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
      primaryLabel: mainText,
      secondaryLabel: subText,
      image: imageURL,
      type,
      album: type === TILE_TYPES.ALBUM ? data : { images: { height: null, width: null, url: null } }
    })
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
      if (arrOfImages.length === 0) return ''
      if (large && arrOfImages.length >= 2) {
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
          clickEvent: () => queueSong(data),
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
    <TouchableOpacity
      onPress={() => tile.clickEvent({ ...tile, clicked })}
      activeOpacity={clicked ? 1 : 0.2}
      style={[styles.buttonSize, clicked ? styles.clickedOpacity : styles.nonClickedOpacity]}
    >
      <ImageBackground
        style={styles.musicTileBackground}
        source={{ uri: tile.imageURL }}
      >

      </ImageBackground>
      <Text>
        test
      </Text>
    </TouchableOpacity>

  )
};

const musicTileSize = Math.round(Dimensions.get('window').width/3);

const styles = StyleSheet.create({
  clickedOpacity: {
    opacity: 0.2
  },
  nonClickedOpacity: {
    opacity: 1
  },
  musicTileBackground: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  buttonSize: {
    width: musicTileSize,
    height: musicTileSize
  }
})



export default WithQueueSong(MusicTile)