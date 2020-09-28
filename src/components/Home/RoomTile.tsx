import React from "react"
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ImageBackground,
  Text
} from 'react-native';
import { Room } from "../../types"
import { textStyles, fonts } from '../../assets/typography'
import colors from '../../assets/colors'

import { useApolloClient } from '@apollo/react-hooks'
import { useNavigation } from '@react-navigation/native';

interface RoomTileProps {
  room: Room
  color: string
}

const RoomTile: React.FC<RoomTileProps> = ({ room, color }) => {
  const combinedStyles = StyleSheet.flatten([styles.tileContainer, { backgroundColor: color }])
  const client = useApolloClient()
  const navigation = useNavigation()

  const goToRoom = () => {
    navigation.navigate("VotingRoom", {
      roomId: room.id
    })
    client.writeData({
      data: {
        roomId: room.id
      }
    })
  }

  return (
    <TouchableOpacity style={combinedStyles} onPress={goToRoom}>
      <View>
        <Text style={[textStyles.p, styles.subTitle]}>
          Room
        </Text>
        <Text style={[textStyles.p, styles.currentlyPlaying]} numberOfLines={1}>
          {room.id}
        </Text>
      </View>
      <View>
        <Text style={[textStyles.p, styles.subTitle]} numberOfLines={1}>
          Currently Playing:
        </Text>
        <Text style={[textStyles.p, styles.currentlyPlaying]} numberOfLines={1}>
          {room?.currentSong ? room.currentSong.song.name : "No song playing"}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  tileContainer: {
    width: 125,
    height: 175,
    borderRadius: 20,
    padding: 10,
    margin: 4,
    display: 'flex',
    justifyContent: 'space-between'
  },
  subTitle: {
    color: colors.white,
    fontSize: 12,
    fontFamily: fonts.sourceSansProLight
  },
  currentlyPlaying: {
    color: colors.white,
    fontFamily: fonts.sourceSansProSemiBold
  }
})

export default RoomTile