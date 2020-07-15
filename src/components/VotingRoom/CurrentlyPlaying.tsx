import React, { useEffect, useState, useContext } from 'react'
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Image,
  Dimensions
} from 'react-native'
import firestore from '@react-native-firebase/firestore';
import Controls from './Controls'
import { useQuery } from '@apollo/react-hooks'
import { GET_ROOM_LOCAL } from "../..//graphql/queries"
import { Room, Song, Artist } from '../../types'
import { textStyles, VotingRoomText } from '../../assets/typography'
import SpotifyContext from "../../spotify/spotifyContext"
// import { DRAWER_HEADER_HEIGHT, BOTTOM_SNAP_POINT } from '../../screens/VotingRoom'
import { DEFAULT_BACKGROUND_SOURCE_IMAGE } from './MusicTile'

export const CURRENTLY_PLAYING_HEIGHT = Dimensions.get('window').height * 0.8

interface CurrentlyPlayingProps {
  isAdmin: boolean
}

const CurrentlyPlaying: React.FC<CurrentlyPlayingProps> = ({
  isAdmin
}) => {
  const [loading, setLoading] = useState(true)
  const [room, setRoom] = useState<Room | undefined>(undefined)
  const [hasSong, setHasSong] = useState<boolean | undefined>()
  const [vibrantColour, setVibrantColour] = useState<number[]>([255, 255, 255])
  const { data: dataRoomId } = useQuery(GET_ROOM_LOCAL)
  const { isConnected } = useContext(SpotifyContext)

  useEffect(() => {
    const unsub = firestore().doc(`rooms/${dataRoomId.roomId}`).onSnapshot((doc) => {
      const room = doc.data() as Room
      setVibrantColour(room?.vibrantColour || [255, 255, 255])
      setRoom(room)
      if (room.currentSong) {
        setHasSong(true)
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
      <Image
        style={styles.image}
        source={{
          uri: room?.currentSong ? room?.currentSong.song.album.images[0].url : DEFAULT_BACKGROUND_SOURCE_IMAGE
        }} />
      <View style={styles.textContainer}>
        <Text style={[VotingRoomText.header, textStyles.h2, styles.center]}>
          {room?.currentSong ? room?.currentSong.song.name : "Currently no song playing"}
        </Text>
        <Text style={[textStyles.p, VotingRoomText.description, styles.center]}>
          {room?.currentSong ?
            room?.currentSong.song.artists.map((artist: Artist) => artist.name).join(', ') :
            isAdmin ? 'Hit the play button to start!' : 'Ask the host to start playin!'
          }
        </Text>
      </View>
      {(isAdmin && isConnected) && <Controls room={room}/>}
    </View>
  )
}


const styles = StyleSheet.create({
  currentlyPlaying: {
    width: '100%',
    height: CURRENTLY_PLAYING_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 100 + 40
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 15,
    marginVertical: 20
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
  center: {
    textAlign: 'center'
  },
  textContainer:{
    marginBottom: 30
  }
})


export default CurrentlyPlaying