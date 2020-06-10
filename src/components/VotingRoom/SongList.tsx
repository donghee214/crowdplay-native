import React, { useEffect, useState } from "react"
import { View, StyleSheet } from "react-native"
import firestore from '@react-native-firebase/firestore';
import { useQuery } from '@apollo/react-hooks'
import { GET_ROOM_LOCAL } from "../../graphql/queries"
import { Song } from '../../types'
import { useApolloClient } from "@apollo/react-hooks";


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
    <View>

    </View>
  )
}

export default SongList