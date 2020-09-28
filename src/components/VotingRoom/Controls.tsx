import React, { useState, useEffect, useContext, useCallback } from 'react'
import SpotifyContext from "../../spotify/spotifyContext"
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text
} from 'react-native'
import { useMutation } from '@apollo/react-hooks'
import { NEXT_SONG } from "../../graphql/mutations"
import { BOTTOM_SNAP_POINT } from '../../utils/constants'
import { Room } from '../../types'
import Previous from '../../assets/components/Previous'
import Skip from '../../assets/components/Skip'
import Play from '../../assets/components/Play'
import Pause from '../../assets/components/Pause'
import Sync from '../../assets/components/Sync'
import colors from '../../assets/colors'

interface ControlProps {
  room: Room | undefined,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  hasSong: boolean,
}

const Controls: React.FC<ControlProps> = ({
  room,
  setLoading,
  hasSong
}) => {
  const [nextSong, { loading, data, error }] = useMutation(NEXT_SONG)
  const {
    token,
    withRenew,
    remote,
    authenticate,
    isConnected,
    connectRemote,
    playerState
  } = useContext(SpotifyContext)


  const play = () => {
    if (!playerState?.track.uri || !room?.currentSong) {
      skip()
      return
    }
    if (playerState.isPaused) {
      remote.resume()
      return
    }
  }

  useEffect(() => {
    setLoading(false)
  }, [error])

  const skip = () => {
    nextSong({
      variables: {
        roomId: room?.id
      }
    })
    setLoading(true)
  }

  const controlSet = useCallback(() => {
    return (
      <React.Fragment>
        <TouchableOpacity disabled={true}>
          <Previous style={styles.smallButton} />
        </TouchableOpacity>
        {
          (playerState?.isPaused || !playerState?.track.uri) ?
            <TouchableOpacity onPress={() => {
              if (hasSong) {
                remote.resume()
              }
              else {
                skip()
              }
            }} disabled={!room}>
              <Play style={styles.largeButton} />
            </TouchableOpacity> :
            <TouchableOpacity onPress={() => remote.pause()} disabled={!room}>
              <Pause style={styles.largeButton} />
            </TouchableOpacity>
        }
        <TouchableOpacity onPress={skip} disabled={!room}>
          <Skip style={styles.smallButton} />
        </TouchableOpacity>
      </React.Fragment>
    )
  }, [playerState])

  const syncSet = () => (
    <TouchableOpacity style={styles.syncContainer} onPress={connectRemote}>
      <Sync style={styles.largeButton} fill={colors.green} />
      <Text style={[styles.syncText]}>
        Sync to Spotify Player
      </Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.controlsContainer}>
      {
        isConnected ? controlSet() : syncSet()
      }
    </View>
  )
}

const styles = StyleSheet.create({
  controlsContainer: {
    flexDirection: 'row',
    width: 350,
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: BOTTOM_SNAP_POINT + 25
  },
  smallButton: {
    width: 36,
    height: 36
  },
  largeButton: {
    height: 48,
    width: 48
  },
  syncText: {
    color: colors.green,
    marginTop: 2
  },
  syncContainer: {
    display: 'flex',
    alignItems: 'center'
  }
})

export default Controls