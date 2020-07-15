import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Animated
} from 'react-native'
import { SpotifySong, Artist } from "../../types"
import { TILE_TYPES } from "../VotingRoom/MusicTile"
import { msToMinuteString } from "../../utils/time"
import { useQuery } from "@apollo/react-hooks"
import { GET_ADDED_SONG_IDS } from "../../graphql/queries"
import useQueueSong from "../../hooks/useQueueSong"
import { textStyles } from '../../assets/typography'
import colors from "../../assets/colors"

interface SongListItemProps {
  data: SpotifySong;
  image: string | undefined;
  type: TILE_TYPES;
  roomId: string,
}

const SongListItem: React.FC<SongListItemProps> = ({ data, image, roomId }) => {
  const queueSong = useQueueSong()
  const fadeAnim = new Animated.Value(0)
  const [clicked, setClicked] = useState(false)
  const { data: addedSongIds } = useQuery(GET_ADDED_SONG_IDS)

  const pressHandler = () => {
    queueSong(data, roomId, clicked)
  }

  const animateRender = () => {
    Animated.timing(fadeAnim, {
      useNativeDriver: true,
      toValue: 1,
      duration: 250
    }).start();
  }

  const animateClicked = () => {
    Animated.timing(fadeAnim, {
      useNativeDriver: true,
      toValue: 0.2,
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

  return (
    <Animated.View style={{ opacity: clicked ? 0.2 : fadeAnim }}>
      <TouchableOpacity
        style={[
          styles.listitemContainer,
          // clicked ? styles.clickedOpacity : styles.nonClickedOpacity
        ]}
        onPress={() => {
          animateClicked()
          pressHandler()
        }}
        disabled={clicked}
      >
        <ImageBackground
          source={{
            uri: data.album?.images ? data.album.images[data.album.images.length - 1].url : image
          }}
          style={styles.backgroundImage}
          onLoad={animateRender}
        />
        <View style={styles.listItemTextContainer}>
          <View style={styles.listItemNameContainer}>
            <Text style={[textStyles.h3, styles.songName]} numberOfLines={1}>
              {data.name}
            </Text>
            <Text style={[textStyles.p, styles.artistName]} numberOfLines={1}>
              {data.artists.map((artist: Artist) => artist.name).join(", ")}
            </Text>
          </View>
          <Text style={[textStyles.p, styles.duration]}>
            {msToMinuteString(data.duration_ms)}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>

  )
}

const styles = StyleSheet.create({
  clickedOpacity: {
    opacity: 0.4
  },
  nonClickedOpacity: {
    opacity: 1
  },
  listitemContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    marginVertical: 10,
    flex: 1,
  },
  backgroundImage: {
    width: 76,
    height: 76,
    borderRadius: 15,
  },
  listItemTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    overflow: 'hidden',
    marginLeft: 16,
    paddingVertical: 5,
    flex: 1,
  },
  listItemNameContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1
  },
  songName: {
    color: colors.white
  },
  artistName: {
    color: colors.whiteSmoke
  },
  duration: {
    color: colors.green
  }
})


export default SongListItem