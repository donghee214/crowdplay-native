import React, { useState, useEffect, useContext } from 'react'
import SpotifyContext from "../../spotify/spotifyContext"
import {
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import { useMutation } from '@apollo/react-hooks'
import { NEXT_SONG } from "../../graphql/mutations"
import nextSong from '../../utils/nextSong'
import { Room } from '../../types'
import Previous from '../../assets/components/Previous'
import Skip from '../../assets/components/Skip'
import Play from '../../assets/components/Play'
import Pause from '../../assets/components/Pause'

interface ControlProps {
  room: Room | undefined
}

const Controls: React.FC<ControlProps> = ({
  room
}) => {
  const [nextSong, { loading, data, error }] = useMutation(NEXT_SONG)
  const {
    token,
    withRenew,
    remote,
    authenticate,
    isConnected,
    playerState
  } = useContext(SpotifyContext)


  const play = () => {
    if(!playerState?.track.uri || !room?.currentSong){
      skip()
      return
    }
    if(playerState.isPaused){
      remote.resume()
      return
    }
  }

  const skip = () => {
    nextSong({
      variables: {
        roomId: room?.id
      }
    })
  }

  return (
    <View style={styles.controlsContainer}>
      <TouchableOpacity disabled={true}>
        <Previous style={styles.smallButton} />
      </TouchableOpacity>
      {
        (playerState?.isPaused || !playerState?.track.uri) ?
          <TouchableOpacity onPress={() => remote.resume()} disabled={!room}>
            <Play style={styles.largeButton} />
          </TouchableOpacity> :
          <TouchableOpacity onPress={() => remote.pause()} disabled={!room}>
            <Pause style={styles.largeButton} />
          </TouchableOpacity>
      }
      <TouchableOpacity onPress={skip} disabled={!room}>
        <Skip style={styles.smallButton} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  controlsContainer: {
    flexDirection: 'row',
    width: 350,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  smallButton: {
    width: 36,
    height: 36
  },
  largeButton: {
    height: 48,
    width: 48
  }
})

export default Controls