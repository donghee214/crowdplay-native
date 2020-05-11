import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Alert
} from 'react-native';

import RoomTileContainer from "../components/RoomTileContainer"

import { textStyles, fonts } from "../assets/typography"
import colors from "../assets/colors"
import { ScrollView } from 'react-native-gesture-handler';

import Button from "../assets/components/Button"

const Home = () => {
  const [joinRoomInput, setJoinRoomInput] = useState<string>("")
  const [createRoomInput, setCreateRoomInput] = useState<string>("")

  return (
    <ScrollView style={styles.homeContainer}>
      <View style={styles.paddedScreenContainer}>
        <Text>
          <Text style={[textStyles.h1, styles.titleText]}>
            chocolate
        </Text>
          <Text style={[textStyles.h3, styles.titleTextEnd]}>
            .
        </Text>
        </Text>
        <Text style={[textStyles.p, styles.sectionHeader]}>
          Join Room
      </Text>
        <TextInput
          style={styles.roomTextInput}
          value={joinRoomInput}
          onChangeText={(text: string) => setJoinRoomInput(text)}
          placeholder={"Enter Room Name"}
        />
        <View style={styles.buttonContainer}>
          <Button onClick={() => "test"}>
            <Text style={[textStyles.p, styles.buttonText]}>
              Join Room
            </Text>
          </Button>
        </View>
        <Text style={[textStyles.p, styles.sectionHeader]}>
          Create Room
        </Text>
        <TextInput
          style={styles.roomTextInput}
          value={createRoomInput}
          onChangeText={(text: string) => setCreateRoomInput(text)}
          placeholder={"Enter Room Name"}
        />
        <View style={styles.buttonContainer}>
          <Button onClick={() => "test"}>
            <Text style={[textStyles.p, styles.buttonText]}>
              Create Room
            </Text>
          </Button>
        </View>
        <Text style={[textStyles.p, styles.sectionHeader]}>
          Nearby
      </Text>
      </View>
      <RoomTileContainer />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  homeContainer: {
    paddingVertical: 25
  },
  titleText: {
    fontSize: 32,
    marginBottom: 12
  },
  titleTextEnd: {
    fontSize: 36,
    color: colors.green
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
  paddedScreenContainer: {
    paddingHorizontal: 25
  },
  buttonContainer: {
    marginVertical: 25
  },
  buttonText: {
    fontSize: 20,
    color: colors.white
  }
});

export default Home