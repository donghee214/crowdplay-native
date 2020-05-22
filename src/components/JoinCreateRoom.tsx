import React, { useEffect, useState, useContext } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput
} from 'react-native'

import Button from "../assets/components/Button"

import { textStyles, fonts } from "../assets/typography"
import colors from "../assets/colors"

import { useLazyQuery } from '@apollo/react-hooks'
import { GET_ROOM } from "../graphql/queries"
import { CREATE_ROOM } from "../graphql/mutations"

const sanitize = (str: string) => {
  str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, "")
  return str.trim()
}

export const JoinRoom = () => {
  const [joinRoomInput, setJoinRoomInput] = useState<string>("")
  const [joinRoom, { loading: joinRoomLoading, data: joinRoomData, error: joinRoomError }] = useLazyQuery(GET_ROOM)

  useEffect(() => {
    if (joinRoomData) {
      // redirect to room page
    }
  }, [joinRoomData])

  const joinRoomHandler = (roomId: string) => {
    roomId = sanitize(roomId)
    console.log(roomId)
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
        <Button onClick={() => joinRoomHandler(joinRoomInput)}>
          <Text style={[textStyles.p, styles.buttonText]}>
            Join Room
            </Text>
        </Button>
      </View>
    </React.Fragment>
  )
}

export const CreateRoom = () => {
  const [createRoomInput, setCreateRoomInput] = useState<string>("")
  const [createRoom, { loading: createRoomLoading, data: createRoomData, error: createRoomError }] = useLazyQuery(CREATE_ROOM)

  const createRoomHandler = (roomId: string) => {
    roomId = sanitize(roomId)
    createRoom({
      variables: { roomId, adminId: "test" }
    })
  }

  useEffect(() => {
    if (createRoomData) {
      // fetch user creds
      // call createroom funciton
    }
  }, [createRoomData])

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
        <Button onClick={() => "test"}>
          <Text style={[textStyles.p, styles.buttonText]}>Create Room</Text>
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
