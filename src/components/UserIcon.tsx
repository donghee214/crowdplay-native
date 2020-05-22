import React, { useEffect, useContext } from "react"
import SpotifyContext from "../spotify/spotifyContext"
import {
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';

import { GET_ME } from "../graphql/queries"
import { useLazyQuery } from '@apollo/react-hooks'

import Account from "../assets/components/Account"
import colors from "../assets/colors"
import { textStyles } from "../assets/typography"

import { getMeResponseType } from "../screens"

const UserIcon = () => {
  const { isAuthenticated, token, authenticate, endSession, renewSession } = useContext(SpotifyContext)

  const [getMe, { loading, data, error }] = useLazyQuery<getMeResponseType>(GET_ME, {
    variables: {
      accessToken: token
    },
    fetchPolicy: "cache-and-network"
  })

  const onPressHandler = () => {
    authenticate()
    // if(isAuthenticated) Alert.alert("go to settings")
    // else authenticate()
  }

  return (
    <TouchableOpacity style={styles.imageContainer} onPress={onPressHandler}>
      {data?.me.images ? <Image source={data.me.images[0]} style={styles.image} /> : <Account color={colors.lightGrey} />}
      <Text style={[textStyles.p, styles.nameText]}>
        {isAuthenticated ? "Settings" : "Sign In"}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  imageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  nameText: {
    color: colors.green,
    marginTop: 1
  },
  image:{
    width: 36,
    height: 36,
    borderRadius: 18
  }
})

export default UserIcon