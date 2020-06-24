import React from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text
} from 'react-native'
import BackButton from '../../assets/components/BackButton'
import { useNavigation } from '@react-navigation/native'
import { GET_ROOM_LOCAL } from "../../graphql/queries"
import { useQuery } from '@apollo/react-hooks'
import { textStyles, VotingRoomText } from '../../assets/typography'
import colors from '../../assets/colors'

export const TOP_NAVBAR_HEIGHT = 50

const TopNavbar = () => {
  const navigation = useNavigation()
  const { data: dataRoomId } = useQuery(GET_ROOM_LOCAL)
  return (
    <View style={styles.container} pointerEvents="auto">
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <BackButton fill={colors.lightBlack}/>
      </TouchableOpacity>
      <View >
        <Text style={[textStyles.p, VotingRoomText.description, styles.center]}>
          Room name
        </Text>
        <Text style={[textStyles.h2, styles.roomName, styles.center]}>
          {dataRoomId.roomId}
        </Text>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    height: TOP_NAVBAR_HEIGHT,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  roomName: {
    color: colors.lightBlack
  },
  center: {
    textAlign: 'center'
  },
  backButton: {
    position: 'absolute',
    zIndex: 1
  }
})

export default TopNavbar