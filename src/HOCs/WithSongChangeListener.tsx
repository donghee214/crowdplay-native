import React, { useState, useEffect, useContext } from 'react'
import SpotifyContext from "../spotify/spotifyContext"
import { useQuery, useLazyQuery } from '@apollo/react-hooks'
import { GET_ME } from "../graphql/queries"
import { getMeResponseType } from "../screens"
import firestore from '@react-native-firebase/firestore';
import { Room, Song } from "../types"

const WithSongChangeListener = (Component: any) => (props: any) => {
  const { token, connectRemote, isConnected, remote, playerState } = useContext(SpotifyContext)
  const [currentlyPlaying, setCurrentlyPlaying] = useState<Song>()
  const [listeningRoomId, setListeningRoomId] = useState<string>()
  const [getMe, { loading, data, error }] = useLazyQuery<getMeResponseType>(GET_ME, {
    fetchPolicy: "cache-and-network"
  })

  useEffect(() => {
    if (playerState?.isPaused && playerState?.playbackPosition === 0) {
      // remote.pause()
      // console.log('GO TO NEXT SONG')
    }
  }, [playerState])


  // listener to ensure remote stays connected if the user is a host
  useEffect(() => {
    (async () => {
      if (listeningRoomId && !isConnected) {
        await connectRemote()
      }
    })()
  }, [isConnected, listeningRoomId])

  useEffect(() => {
    if (!listeningRoomId) return
    const unsub = firestore().doc(`rooms/${listeningRoomId}`).onSnapshot((doc) => {
      const room = doc.data() as Room
      setCurrentlyPlaying((currentlyPlaying) => {
        if(room.currentSong && currentlyPlaying?.trackId !== room.currentSong.trackId){
          console.log(room.currentSong)
          remote.playUri(room.currentSong.song.uri)
          return room.currentSong
        }
        return currentlyPlaying
      })
    })
    return () => unsub()
  }, [listeningRoomId])

  useEffect(() => {
    getMe({
      variables: {
        accessToken: token
      }
    })
  }, [token])

  useEffect(() => {
    (async () => {
      if (!data) return
      const roomsSnapshot = await firestore().collection("rooms").get()
      const rooms = roomsSnapshot.docs.map((doc): Room => doc.data() as Room)
      const userRoom = rooms.find(room => room?.admin?.id === data.me.id)
      if (userRoom) {
        setListeningRoomId(userRoom.id)
      }
    })()
  }, [data])

  return <Component {...props} />
}

export default WithSongChangeListener