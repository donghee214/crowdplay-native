import React, { useEffect, useState, useContext } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ActivityIndicator
} from 'react-native'
import SpotifyContext from "../../spotify/spotifyContext"

import Button from "../../assets/components/Button"

import { textStyles, fonts } from "../../assets/typography"
import colors from "../../assets/colors"

import { useQuery, useMutation, useLazyQuery, useApolloClient } from '@apollo/react-hooks'
import { GET_ROOM, GET_ME } from "../../graphql/queries"
import { CREATE_ROOM } from "../../graphql/mutations"
import { getMeResponseType } from "../../screens"
import { useNavigation } from '@react-navigation/native';

const sanitize = (str: string) => {
  str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, "")
  return str.trim()
}

const writeRoomIdToCache = ({ client, roomId }:{client: any, roomId: string}) => {
  client.writeData({
    data: {
      roomId
    }
  })
}

export const JoinRoom = () => {
  const [joinRoomInput, setJoinRoomInput] = useState<string>("")
  const [joinRoom, { loading: joinRoomLoading, data: joinRoomData, error: joinRoomError }] = useLazyQuery(GET_ROOM, {
    fetchPolicy: 'no-cache'
  })
  const client = useApolloClient()
  const navigation = useNavigation()

  useEffect(() => {
    if (joinRoomData) {
      navigation.navigate("VotingRoom", {
        roomId: joinRoomData.room.id
      })
      writeRoomIdToCache({
        client, 
        roomId: joinRoomData.room.id
      })
    }
  }, [joinRoomData])

  const joinRoomHandler = (roomId: string) => {
    roomId = sanitize(roomId.toLowerCase())
    joinRoom({
      variables: { id: roomId }
    })
  }

  return (
    <React.Fragment>
      <Text style={[textStyles.p, styles.sectionHeader]}>
        Join Room
    </Text>
      <TextInput
        style={styles.roomTextInput}
        value={joinRoomInput}
        onChangeText={(text: string) => setJoinRoomInput(text)}
        placeholder={"Enter Room Name"}
      />
      {joinRoomError && (
        <Text style={styles.errorMessage}>{joinRoomError.message}</Text>
      )}
      <View style={styles.buttonContainer}>
        <Button onClick={() => joinRoomHandler(joinRoomInput)} disabled={joinRoomLoading}>
          {joinRoomLoading ?
            <ActivityIndicator size="small" color={colors.white} /> :
            <Text style={[textStyles.p, styles.buttonText]}>Join Room</Text>
          }
        </Button>
      </View>
    </React.Fragment>
  )
}

export const CreateRoom = () => {
  const { token, withRenew } = useContext(SpotifyContext)
  const [createRoomInput, setCreateRoomInput] = useState<string>("")
  const [createRoom, { loading: createRoomLoading, data: createRoomData, error: createRoomError }] = useMutation(CREATE_ROOM)
  const [getMe, { data: meData }] = useLazyQuery<getMeResponseType>(GET_ME, {
    variables: {
      accessToken: token
    },
    fetchPolicy: "cache-first"
  })
  const client = useApolloClient()
  const navigation = useNavigation()

  useEffect(() => {
    if (token) {
      withRenew(getMe)
    }
  }, [token])

  useEffect(() => {
    if (createRoomData?.addRoom?.id) {
      navigation.navigate('VotingRoom', {
        roomId: createRoomData.addRoom.id
      })
      writeRoomIdToCache({
        client,
        roomId: createRoomData?.addRoom?.id
      })
    }

  }, [createRoomData])

  const createRoomHandler = () => {
    const roomId = sanitize(createRoomInput.toLowerCase())
    createRoom({
      variables: { roomId, admin: meData?.me }
    })
  }

  return (
    <React.Fragment>
      <Text style={[textStyles.p, styles.sectionHeader]}>Create Room</Text>
      <TextInput
        style={styles.roomTextInput}
        value={createRoomInput}
        onChangeText={(text: string) => setCreateRoomInput(text)}
        placeholder={"Enter Room Name"}
      />
      {createRoomError && (
        <Text style={styles.errorMessage}>{createRoomError.message}</Text>
      )}
      <View style={styles.buttonContainer}>
        <Button onClick={() => createRoomHandler()} disabled={createRoomLoading}>
          {createRoomLoading ?
            <ActivityIndicator size="small" color={colors.white} /> :
            <Text style={[textStyles.p, styles.buttonText]}>Create Room</Text>
          }
        </Button>
      </View>
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
  errorMessage: {
    marginTop: 4,
    color: colors.red
  },
  sectionHeader: {
    fontSize: 18,
    color: colors.lightGrey,
    marginTop: 16,
  },
  roomTextInput: {
    fontSize: 20,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightBlack,
    paddingHorizontal: 1,
    paddingVertical: 4,
    fontFamily: fonts.sourceSansProRegular
  },
  buttonContainer: {
    marginVertical: 25
  },
  buttonText: {
    fontSize: 20,
    color: colors.white
  },
});
