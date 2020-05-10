import React from "react"
import {
  View,
  StyleSheet
} from 'react-native';

interface RoomTileProps{
  color: string
}

const RoomTile: React.FC<RoomTileProps> = ({ color }) => {
  const combinedStyles = StyleSheet.flatten([styles.tileContainer, { backgroundColor: color }])
  return (
    <View style={combinedStyles}>

    </View>
  )
}

const styles = StyleSheet.create({
  tileContainer: {
    width: 125,
    height: 250,
    borderRadius: 20,
    padding: 20,
    margin: 3,
  }
})

export default RoomTile