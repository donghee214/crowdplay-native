import React, { useContext, useEffect, useState } from 'react'
import SpotifyContext from "../spotify/spotifyContext"
import {
  View,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native'
import Animated from 'react-native-reanimated'
import { useQuery, useLazyQuery } from '@apollo/react-hooks'

import { GET_ME, GET_ROOM, GET_ROOM_LOCAL } from "../graphql/queries"
import CurrentlyPlaying, { CURRENTLY_PLAYING_HEIGHT } from '../components/VotingRoom/CurrentlyPlaying'
import TopNavbar from '../components/VotingRoom/TopNavbar'
import colors from '../assets/colors'
import SongList from '../components/VotingRoom/SongList'
import BottomSheet from 'reanimated-bottom-sheet'
import { BOTTOM_SNAP_POINT, DRAWER_HEADER_HEIGHT } from '../utils/constants'
import LinearGradient from 'react-native-linear-gradient';

const TOP_SNAP_POINT = CURRENTLY_PLAYING_HEIGHT


const VotingRoom = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [vibrantColour, setVibrantColour] = useState<number[]>([255, 255, 255])
  const { token, withRenew, remote, authenticate } = useContext(SpotifyContext)
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

  const renderHandler = () => {
    return (
      <View style={styles.handlerContainer}>
        <View style={styles.handlerBar} />
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        start={{ x: -0.2, y: 0.15 }} end={{ x: 0.35, y: 0.8 }}
        colors={[
          `rgba(${vibrantColour[0]}, ${vibrantColour[1]}, ${vibrantColour[2]}, 0.6)`,
          `rgba(${vibrantColour[0]}, ${vibrantColour[1]}, ${vibrantColour[2]}, 0)`]}
        style={StyleSheet.absoluteFillObject}
      />
      {/* WORKAROUND FOR SAFEAREAVIEW NOT WORKING WITH BOTTOMSHEET  */}
      <View style={{ height: 44 }} />
      <TopNavbar />
      <CurrentlyPlaying isAdmin={isAdmin} setVibrantColour={setVibrantColour}/>
      <Animated.View
        style={[StyleSheet.absoluteFillObject, {
          opacity: fall.interpolate({
            inputRange: [-0.2, 1],
            outputRange: [1, 0],
            extrapolate: Animated.Extrapolate.CLAMP
          }),
          backgroundColor: 'black',
        }]}
        pointerEvents="none"
      >
      </Animated.View>
      <BottomSheet
        snapPoints={[TOP_SNAP_POINT, BOTTOM_SNAP_POINT]}
        renderContent={() => <SongList />}
        onOpenEnd={() => setIsOpen(true)}
        onCloseEnd={() => setIsOpen(false)}
        callbackNode={fall}
        initialSnap={1}
        borderRadius={20}
        renderHeader={() => (
          <View style={styles.buttonContainer}>
            <TouchableOpacity>
              {renderHandler()}
            </TouchableOpacity>
          </View>
        )}
      />
    </View>

  )
}

const styles = StyleSheet.create({
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
    height: DRAWER_HEADER_HEIGHT,
    // backgroundColor: colors.whiteSmoke,
  },
  handlerBar: {
    position: 'absolute',
    backgroundColor: '#D1D1D6',
    top: 15,
    borderRadius: 3,
    height: 5,
    width: 40,
  },
  handlerContainer: {
    position: 'absolute',
    alignSelf: 'center',
    top: 40,
    height: 80,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    zIndex: 2,
  },
})

export default VotingRoom