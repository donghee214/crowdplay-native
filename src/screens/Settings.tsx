import React, { useContext, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  ActivityIndicator
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native'
import { SettingsRouteProps } from './index'
import { textStyles, fonts } from '../assets/typography'
import colors from '../assets/colors'
import Button from '../assets/components/Button'
import SpotifyContext from "../spotify/spotifyContext"
import { useApolloClient } from '@apollo/react-hooks'


interface SettingButtonProps {
  press: () => void
  text: string
}

const SettingButton: React.FC<SettingButtonProps> = ({ press, text }) => {
  return (
    <View>
      <Text style={[textStyles.p, styles.text]}>
        {text}
      </Text>
    </View>
  )
}

export default () => {
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation()
  const route = useRoute<SettingsRouteProps>()
  const { endSession } = useContext(SpotifyContext)
  const client = useApolloClient()

  const logout = async () => {
    setLoading(true)
    await client.cache.reset()
    await AsyncStorage.clear()
    await endSession()
    setLoading(false)
    navigation.navigate("Home")
  }

  return (
    <SafeAreaView style={styles.paddedScreenContainer}>
      <ScrollView>
        <View style={styles.userContainer}>
          <Image source={route.params.me.images[0]} style={styles.imageContainer} />
          <Text style={[styles.text]}>
            {route.params.me.display_name}
          </Text>
        </View>
        <View style={styles.settingsContainer}>

        </View>
        <Button onClick={logout}>
          {
            loading ?
              <ActivityIndicator size="small" color={colors.white} /> :
              <Text style={[textStyles.p, styles.logoutText]}>Logout</Text>
          }
        </Button>
      </ScrollView>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  paddedScreenContainer: {
    paddingHorizontal: 12,
    paddingVertical: 25
  },
  userContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  imageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32
  },
  settingsContainer: {
    marginTop: 12,
    marginBottom: 24
  },
  text: {
    fontSize: 22,
    color: colors.lightBlack,
    marginLeft: 32,
    fontFamily: fonts.sourceSansProSemiBold
  },
  logoutText: {
    fontSize: 20,
    color: colors.white,
  },
  button: {
    marginTop: 16
  }
})