import React, { useEffect, useState } from "react"
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  // FlatList,
} from "react-native"
import firestore from '@react-native-firebase/firestore';
import { useQuery } from '@apollo/react-hooks'
import { GET_ROOM_LOCAL } from "../../graphql/queries"
import { Song } from '../../types'
import { useApolloClient } from "@apollo/react-hooks";
import MusicTile, { TILE_TYPES } from './MusicTile'
import { textStyles, VotingRoomText } from '../../assets/typography'
import colors from '../../assets/colors'
import { FlatList } from 'react-native-gesture-handler'

const SongList: React.FC<{}> = () => {
  const [songs, setSongs] = useState<Song[]>([])
  const client = useApolloClient()
  const { data: dataRoomId } = useQuery(GET_ROOM_LOCAL)

  const addSongs = (newSongs: Song[]) => {
    newSongs.sort((a, b) => b.score - a.score)
    setSongs(prevSongs => [...prevSongs, ...newSongs])
  }

  const deleteSongs = (deleteSongs: String[]) => {
    setSongs((songs) => {
      const newSongs = songs.filter((song) => !deleteSongs.includes(song.trackId))
      return newSongs
    })
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
      deleteSongs(deletedSongs)
      modifySongs(modifiedSongs)
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
        contentContainerStyle={{
          paddingBottom: 250
        }}
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
            data={item.song}
            score={item.score}
            roomId={dataRoomId.roomId}
            voters={item.voters}
            tileType={TILE_TYPES.ADDED_TRACK}
          />
        )}
      />
  )
}

const styles = StyleSheet.create({
  mainContentContainer: {
    backgroundColor: colors.whiteSmoke,
    width: Dimensions.get('window').width,
    zIndex: 2,
    flexGrow: 1,
    // flex: 1,
    minHeight: Dimensions.get('window').height,
    paddingBottom: 150
  },
  topHeader: {
    display: 'flex',
    paddingHorizontal: 22.5,
    paddingVertical: 27.5
  },
  // flatlistContainer: {
  //   minHeight: Dimensions.get('window').height,
  //   height: 'auto'
  // }

})

export default SongList