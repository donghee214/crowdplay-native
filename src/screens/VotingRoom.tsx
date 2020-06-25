import React, { useContext, useEffect, useState } from 'react'
import SpotifyContext from "../spotify/spotifyContext"
import {
  View,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native'
import Animated from 'react-native-reanimated'
import { useQuery, useLazyQuery } from '@apollo/react-hooks'
import { useNavigation } from '@react-navigation/native';
import { GET_ME, GET_ROOM, GET_ROOM_LOCAL } from "../graphql/queries"
import CurrentlyPlaying, { CURRENTLY_PLAYING_HEIGHT } from '../components/VotingRoom/CurrentlyPlaying'
import TopNavbar, { TOP_NAVBAR_HEIGHT } from '../components/VotingRoom/TopNavbar'
import colors from '../assets/colors'
import SongList from '../components/VotingRoom/SongList'
import BottomSheet from 'reanimated-bottom-sheet'
import UpArrow from '../assets/components/UpArrow'
import { BlurView } from "@react-native-community/blur";

const HEADER_HEIGHT = 50;
const windowHeight = Dimensions.get('window').height;
const TOP_SNAP_POINT = windowHeight * 0.8

const VotingRoom = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
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

  const fall = new Animated.Value(1)

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
      <Animated.View
        style={[StyleSheet.absoluteFillObject, {
          opacity: fall.interpolate({
            inputRange: [0, 1.1],
            outputRange: [1, 0]
          }),
        }]}
        pointerEvents="none"
      >
        <BlurView
          style={StyleSheet.absoluteFillObject}
          blurType="dark"
          blurAmount={10}
          reducedTransparencyFallbackColor="white"
        />
      </Animated.View>
      <View style={{ flex: 1 }}>
        <BottomSheet
          snapPoints={[TOP_SNAP_POINT, 200]}
          renderContent={() => <SongList />}
          onOpenEnd={() => setIsOpen(true)}
          onCloseEnd={() => setIsOpen(false)}
          callbackNode={fall}
          initialSnap={1}
          borderRadius={20}
          renderHeader={() => (
            <TouchableOpacity style={styles.buttonContainer}>
              <UpArrow
                fill={isOpen ? colors.white : colors.lightGrey}
                style={isOpen ? styles.rotation : styles.noRotation}
              />
            </TouchableOpacity>
          )}
        />
      </View>

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
  },
  rotation: {
    transform: [{ rotate: '180deg' }]
  },
  noRotation: {
    transform: [{ rotate: '0deg' }]
  },
  buttonContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    height: HEADER_HEIGHT
  },
})

export default VotingRoom