import React, { useEffect, useState } from 'react'
import {
  View,
  StyleSheet,
  ActivityIndicator
} from 'react-native'
import firestore from '@react-native-firebase/firestore';
import { useQuery } from '@apollo/react-hooks'
import { GET_ROOM_LOCAL } from "../..//graphql/queries"
import { Room, Song } from '../../types'


const CurrentlyPlaying: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [currentSong, setCurrentSong] = useState<Song | boolean | undefined>(undefined)
  const [vibrantColour, setVibrantColour] = useState<number[]>([255, 255, 255])
  const { data: dataRoomId } = useQuery(GET_ROOM_LOCAL)

  useEffect(() => {
    const unsub = firestore().doc(`rooms/${dataRoomId.roomId}`).onSnapshot((doc) => {
      const room = doc.data() as Room
      setVibrantColour(room?.vibrantColour || [255, 255, 255])
      if (room.currentSong) setCurrentSong(room.currentSong)
      else setCurrentSong(false)
    })
    return () => unsub()
  }, [])

  return (
    <View>
      <ActivityIndicator animating={currentSong === undefined} />
      
    </View>
  )
}

export default CurrentlyPlaying