import React, { useEffect, useState } from "react"
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  FlatList
} from "react-native"
import firestore from '@react-native-firebase/firestore';
import { useQuery } from '@apollo/react-hooks'
import { GET_ROOM_LOCAL } from "../../graphql/queries"
import { Song } from '../../types'
import { useApolloClient } from "@apollo/react-hooks";
import MusicTile, { TILE_TYPES } from './MusicTile'
import { textStyles, VotingRoomText } from '../../assets/typography'
import colors from '../../assets/colors'

const SongList: React.FC<{}> = () => {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState<boolean>()
  const client = useApolloClient()
  const { data: dataRoomId } = useQuery(GET_ROOM_LOCAL)

  const addSongs = (newSongs: Song[]) => {
    newSongs.sort((a, b) => b.score - a.score)
    setSongs(prevSongs => [...prevSongs, ...newSongs])
  }

  const deleteSongs = (deleteSongs: String[]) => {
    const newSongs = songs.filter((song) => deleteSongs.includes(song.trackId))
    setSongs(newSongs)
  }

  const modifySongs = (modifySongs: Song[]) => {
    setSongs((prevSongs: Song[]) => {
      modifySongs.forEach((songToModify) => {
        const idx = prevSongs.findIndex((song) => songToModify.trackId === song.trackId)
        prevSongs[idx] = songToModify
      })
      return [...prevSongs]
    })
  }

  useEffect(() => {
    const unsub = firestore().collection(`rooms/${dataRoomId?.roomId}/songs`).onSnapshot((snapshot) => {
      let newSongs: Song[] = [], modifiedSongs: Song[] = [], deletedSongs: string[] = []
      snapshot.docChanges().forEach((change) => {
        const song = change.doc.data() as Song
        if (change.type === "added") {
          newSongs.push(song)
        }
        if (change.type === "modified") {
          modifiedSongs.push(song)
        }
        if (change.type === "removed") {
          deletedSongs.push(song.trackId)
        }
      })
      addSongs(newSongs)
      // deleteSongs(deletedSongs)
      modifySongs(modifiedSongs)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  useEffect(() => {
    client.writeData({
      data: {
        songs: songs.map((song: Song) => song.trackId)
      }
    })
  }, [songs])

  return (
    <FlatList
      data={songs}
      bounces={false}
      style={styles.mainContentContainer}
      ListHeaderComponent={
        <View style={styles.topHeader}>
          <Text style={[textStyles.h1, VotingRoomText.header]}>
            Up Next
        </Text>
          <Text style={[textStyles.p, VotingRoomText.description]}>
            Tap to upvote
        </Text>
        </View>
      }
      numColumns={3}
      keyExtractor={(item: Song) => item.trackId}
      renderItem={({ item }: { item: Song }) => (
        <MusicTile
          key={item.trackId}
          data={item.song}
          score={item.score}
          roomId={dataRoomId.roomId}
          voters={item.voters}
          tileType={TILE_TYPES.ADDED_TRACK}
        />
      )}
    />
    // <View style={styles.songContainer}>
    //   {songs ?
    //     songs.map((song: Song) =>
    //       <MusicTile
    //         key={song.trackId}
    //         data={song.song}
    //         score={song.score}
    //         roomId={dataRoomId.roomId}
    //         voters={song.voters}
    //         tileType={TILE_TYPES.ADDED_TRACK}
    //       />) : 
    //       <View>
    //         <Text>
    //           No songs added yet
    //         </Text>
    //         <Text>

    //         </Text>
    //       </View>
    //     }
    // </View>
  )
}

const styles = StyleSheet.create({
  mainContentContainer: {
    backgroundColor: colors.whiteSmoke,
    height: 2000,
    width: Dimensions.get('window').width,
    zIndex: 2
  },
  topHeader: {
    display: 'flex',
    paddingHorizontal: 22.5,
    paddingVertical: 27.5
  }
})

export default SongList