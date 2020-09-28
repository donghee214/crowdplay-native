import React, { useState, useEffect } from "react"
import {
  View,
  StyleSheet,
  Text,
  ScrollView
} from 'react-native';
import RoomTile from "./RoomTile"
import firestore from '@react-native-firebase/firestore';
import { textStyles } from '../../assets/typography'
import { Room } from "../../types"


const RoomTileContainer = () => {
  const [rooms, setRooms] = useState<Room[]>([])
  const colors = ["#5756FC", "#E586A3", "#88D1D5", "#59C3C3", "#52489C"]

  useEffect(() => {
    (async () => {
      const roomsSnapshot = await firestore().collection("rooms").get()
      const rooms = roomsSnapshot.docs.map((doc): Room => doc.data() as Room)
      setRooms(rooms)
    })()
  }, [])

  useEffect(() => {
      const unsub = firestore().collection("rooms").onSnapshot((snapshot) => {
          let rooms = snapshot.docs.map((doc): Room => doc.data() as Room)
          console.log(rooms)
          setRooms(rooms)
      })
      return () => unsub()
  }, [])

  const renderRooms = () => {
    if (!rooms) {
        return <Text>Loading</Text>
    }
    else if (rooms.length == 0) {
        return <Text style={[textStyles.h2, styles.textStyle]}>No rooms found around your area!</Text>
    }
    return rooms.map((room: Room, index: any) => (
        <RoomTile
            key={room.id}
            color={colors[index % colors.length]}
            room={room}
         />
    ))
  }
  return (
    <ScrollView horizontal={true} style={styles.roomTileContainer}>
      {renderRooms()}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  roomTileContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    width: "100%"
  },
  textStyle: {
    paddingHorizontal: 24,
    paddingVertical: 4
  }
})

export default RoomTileContainer