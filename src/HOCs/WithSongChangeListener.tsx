import React, { useState, useEffect, useContext } from 'react'
import SpotifyContext from "../spotify/spotifyContext"
import { useMutation, useLazyQuery } from '@apollo/react-hooks'
import { GET_ME } from "../graphql/queries"
import { NEXT_SONG } from "../graphql/mutations"
import { getMeResponseType } from "../screens"
import firestore from '@react-native-firebase/firestore';
import { Room, Song } from "../types"
import { useApolloClient } from '@apollo/react-hooks'

const WithSongChangeListener = (Component: any) => (props: any) => {
  const { token, connectRemote, isConnected, remote, playerState } = useContext(SpotifyContext)
  const [nextSong] = useMutation(NEXT_SONG)
  const client = useApolloClient()

  const [currentlyPlaying, setCurrentlyPlaying] = useState<Song>()
  const [listeningRoomId, setListeningRoomId] = useState<string>()
  const [getMe, { loading, data, error }] = useLazyQuery<getMeResponseType>(GET_ME, {
    fetchPolicy: "cache-and-network"
  })

  useEffect(() => {
    if (listeningRoomId && playerState?.isPaused && playerState?.playbackPosition === 0) {
      nextSong({
        variables: {
          roomId: listeningRoomId
        }
      })
      console.log('GO TO NEXT SONG')
    }
  }, [playerState, listeningRoomId])


  // listener to ensure remote stays connected if the user is a host
  useEffect(() => {
    (async () => {
      if (listeningRoomId && !isConnected) {
        // UNCOMMENT THIS FOR PRODUCTION
        await connectRemote()
      }
    })()
  }, [isConnected, listeningRoomId])

  useEffect(() => {
    if (!listeningRoomId) return
    const unsub = firestore().doc(`rooms/${listeningRoomId}`).onSnapshot((doc) => {
      const room = doc.data() as Room
      setCurrentlyPlaying((currentlyPlaying) => {
        if (room?.currentSong && currentlyPlaying?.trackId !== room.currentSong.trackId) {
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
    if (!data) return
    const unsub = firestore().collection("rooms").onSnapshot((snapshot) => {
      const rooms = snapshot.docs.map((doc): Room => doc.data() as Room)
      const userRoom = rooms.find(room => room?.admin?.id === data.me.id)
      if (userRoom) {
        client.writeData({
          data: {
            userHostRoomId: userRoom.id
          }
        })
        setListeningRoomId(userRoom.id)
      }
      else{
        client.writeData({
          data: {
            userHostRoomId: ""
          }
        })
        setListeningRoomId("")
      }
    })
    return () => unsub()
  }, [data])

  return <Component {...props} />
}

export default WithSongChangeListener