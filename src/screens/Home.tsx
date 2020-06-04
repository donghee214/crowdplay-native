import React, { useEffect, useState, useContext } from 'react'
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView
} from 'react-native'

import RoomTileContainer from "../components/Home/RoomTileContainer"
import UserIcon from "../components/Home/UserIcon"

import { textStyles, fonts } from "../assets/typography"
import colors from "../assets/colors"
import { ScrollView } from 'react-native-gesture-handler'

import { JoinRoom, CreateRoom } from "../components/Home/JoinCreateRoom"
import SpotifyContext from '../spotify/spotifyContext';

const Home = () => {
  return (
    <ScrollView style={styles.homeContainer}>
      <SafeAreaView>
        <View style={styles.paddedScreenContainer}>
          <View style={styles.topBarContainer}>
            <Text>
              <Text style={[textStyles.h1, styles.titleText]}>chocolate</Text>
              <Text style={[textStyles.h3, styles.titleTextEnd]}>.</Text>
            </Text>
            <UserIcon />
          </View>
          <JoinRoom />          
          <CreateRoom />
          <Text style={[textStyles.p, styles.sectionHeader]}>
            Nearby
          </Text>
        </View>
        <RoomTileContainer />
      </SafeAreaView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  homeContainer: {
    paddingVertical: 25,
    backgroundColor: colors.white
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
  errorMessage: {
    marginTop: 4,
    color: colors.red
  },
  topBarContainer:{
    display: 'flex',
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16
  }
});

export default Home