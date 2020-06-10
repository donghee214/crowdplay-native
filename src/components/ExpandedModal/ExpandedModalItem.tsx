import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity
} from 'react-native'
import { SpotifySong, Artist } from "../../types"
import { TILE_TYPES } from "../VotingRoom/MusicTile"
import { msToMinuteString } from "../../utils"
import { useQuery } from "@apollo/react-hooks"
import { GET_ADDED_SONG_IDS } from "../../graphql/queries"
import WithQueueSong from "../../HOCs/WithQueueSong"
import { textStyles } from '../../assets/typography'
import colors from "../../assets/colors"

interface SongListItemProps {
  data: SpotifySong;
  image: string | undefined;
  type: TILE_TYPES;
  roomId: string,
  queueSong: (
    data: SpotifySong,
    roomId: string,
    clicked: boolean
  ) => void
}

const SongListItem: React.FC<SongListItemProps> = ({ data, image, queueSong, roomId }) => {
  const [clicked, setClicked] = useState(false)
  const { data: addedSongIds } = useQuery(GET_ADDED_SONG_IDS)

  const pressHandler = () => {
    queueSong(data, roomId, clicked)
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
    <TouchableOpacity style={styles.listitemContainer} onPress={pressHandler} disabled={clicked}>
      <ImageBackground
        source={{
          uri: data.album ? data.album.images[data.album.images.length - 1].url : image
        }}
        style={styles.backgroundImage}
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
  )
}

const styles = StyleSheet.create({
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
    color: colors.lightBlack
  },
  artistName: {
    color: colors.lightGrey
  },
  duration: {
    color: colors.green
  }
})


export default WithQueueSong(SongListItem)