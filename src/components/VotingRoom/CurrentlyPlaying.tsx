import React, { useEffect, useState } from 'react'
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  ImageBackground,
  Dimensions
} from 'react-native'
import firestore from '@react-native-firebase/firestore';
import Controls from './Controls'
import { useQuery } from '@apollo/react-hooks'
import { GET_ROOM_LOCAL } from "../..//graphql/queries"
import { Room, Song, Artist } from '../../types'
import { textStyles, VotingRoomText } from '../../assets/typography'

export const CURRENTLY_PLAYING_HEIGHT = Dimensions.get('window').height * 0.7

interface CurrentlyPlayingProps{
  isAdmin: boolean
}

const CurrentlyPlaying: React.FC<CurrentlyPlayingProps> = ({
  isAdmin
}) => {
  const [loading, setLoading] = useState(true)
  const [currentSong, setCurrentSong] = useState<Song | undefined>(undefined)
  const [hasSong, setHasSong] = useState<boolean | undefined>()
  const [vibrantColour, setVibrantColour] = useState<number[]>([255, 255, 255])
  const { data: dataRoomId } = useQuery(GET_ROOM_LOCAL)

  useEffect(() => {
    const unsub = firestore().doc(`rooms/${dataRoomId.roomId}`).onSnapshot((doc) => {
      const room = doc.data() as Room
      setVibrantColour(room?.vibrantColour || [255, 255, 255])
      if (room.currentSong) {
        setHasSong(true)
        setCurrentSong(room.currentSong)
      }
      else {
        setHasSong(false)
      }
    })
    return () => unsub()
  }, [])

  return (
    <View style={styles.currentlyPlaying}>
      <ActivityIndicator size={'large'} style={styles.loading} animating={hasSong === undefined} />
      {currentSong ?
        <React.Fragment>
          <ImageBackground source={currentSong.song.album.images.slice(-1)[0]} />
          <View>
            <Text>
              {currentSong.song.name}
            </Text>
            <Text>
              {currentSong.song.artists.map((artist: Artist) => artist.name).join(', ')}
            </Text>
          </View>
        </React.Fragment> 
        : 
        <View>
          <Text style={[VotingRoomText.header, textStyles.h2, styles.center]}>
            Currently no song playing
          </Text>
          <Text style={[textStyles.p, VotingRoomText.description, styles.center]}>
            {isAdmin ? 'Hit the play button to start!' : 'Ask the host to start playin!'}
          </Text>
        </View>
      }
    </View>
  )
}


const styles = StyleSheet.create({
  currentlyPlaying: {
    width: '100%',
    height: CURRENTLY_PLAYING_HEIGHT,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  backgroundImage: {
    width: 300,
    height: 300,
    borderRadius: 20
  },
  loading: {
    position: 'absolute',
    top: 200
  },
  center:{
    textAlign: 'center'
  }
})


export default CurrentlyPlaying