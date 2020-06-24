import React, { useContext, useEffect, useState } from 'react'
import SpotifyContext from "../spotify/spotifyContext"
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Dimensions,
  SafeAreaView
} from 'react-native'
import { useQuery, useLazyQuery } from '@apollo/react-hooks'
import { useNavigation } from '@react-navigation/native';
import { GET_ME, GET_ROOM, GET_ROOM_LOCAL } from "../graphql/queries"
import CurrentlyPlaying, { CURRENTLY_PLAYING_HEIGHT } from '../components/VotingRoom/CurrentlyPlaying'
import TopNavbar, { TOP_NAVBAR_HEIGHT } from '../components/VotingRoom/TopNavbar'
import colors from '../assets/colors'
import { textStyles, VotingRoomText } from '../assets/typography'
import SongList from '../components/VotingRoom/SongList'
import BottomDrawer from '../HOCs/BottomDrawer'


const VotingRoom = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const { token, withRenew, remote, connectRemote, authenticate } = useContext(SpotifyContext)
  const navigation = useNavigation()
  const { data: dataRoomId } = useQuery(GET_ROOM_LOCAL)
  const { data: meData } = useQuery(GET_ME, {
    variables: {
      accessToken: token
    },
    fetchPolicy: 'cache-first'
  })

  const [getRoom, { data: roomData }] = useLazyQuery(GET_ROOM, {
    fetchPolicy: 'no-cache'
  })

  useEffect(() => {
    if (dataRoomId) {
      getRoom({
        variables: {
          id: dataRoomId.roomId
        }
      })
    }
  }, [dataRoomId])

  useEffect(() => {
    if (meData && roomData) {
      setIsAdmin(meData.me.id === roomData.room.admin.id)
    }
  }, [meData, roomData])

  useEffect(() => {
    if (isAdmin) {
      // connectRemote()
    }
  }, [isAdmin])

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <TopNavbar />
      <CurrentlyPlaying isAdmin={isAdmin} />
      <BottomDrawer>
        {/* <ScrollView style={styles.scrollViewContainer} bounces={false}>
          <View style={styles.mainContentContainer}>
            <View style={styles.topHeader}>
              <Text style={[textStyles.h1, VotingRoomText.header]}>
                Up Next
            </Text>
              <Text style={[textStyles.p, VotingRoomText.description]}>
                Tap to upvote
            </Text>
            </View>
            <SongList />
          </View>
        </ScrollView> */}
        <SongList />
      </BottomDrawer>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  buffer: {
    height: TOP_NAVBAR_HEIGHT + CURRENTLY_PLAYING_HEIGHT,
    backgroundColor: 'transparent'
  },
  mainContentContainer: {
    backgroundColor: colors.whiteSmoke,
    borderRadius: 35,
    // alignSelf: 'stretch',
    // display: 'flex',
    height: 2000,
    width: Dimensions.get('window').width,
    zIndex: 2
  },
  scrollViewContainer: {
    position: 'absolute',
    height: Dimensions.get('window').height
  },
  text: {
    color: colors.lightGreen
  },
  topHeader: {
    display: 'flex',
    paddingHorizontal: 22.5,
    paddingVertical: 27.5
  }
})

export default VotingRoom