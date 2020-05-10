import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
} from 'react-native';

import RoomTileContainer from "../components/RoomTileContainer"

import { textStyles } from "../assets/typography"
import colors from "../assets/colors"

const Home = () => {
  return (
    <View style={styles.homeContainer}>
      <Text>
        <Text style={[textStyles.h1, styles.titleText]}>
          chocolate
        </Text>
        <Text style={[textStyles.h1, styles.titleTextEnd]}>
          .
        </Text>
      </Text>
      <Text style={[textStyles.p, styles.sectionHeader]}>
        Nearby
      </Text>
      <RoomTileContainer />
    </View>
  )
}

const styles = StyleSheet.create({
  homeContainer:{
    padding: 25
  },
  titleText: {
    fontSize: 32
  },
  titleTextEnd: {
    fontSize: 36,
    color: colors.green
  },
  sectionHeader:{
    fontSize: 18,
    color: colors.lightGrey,
    marginTop: 24,
  }
});

export default Home