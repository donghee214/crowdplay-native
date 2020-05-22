import React, { useEffect, useContext } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from "./Home"

import { GET_ME } from "../graphql/queries"
import { useLazyQuery } from '@apollo/react-hooks'

import { User } from "../types"

import SpotifyContext from "../spotify/spotifyContext"

export interface getMeResponseType {
  me: User
}


const Stack = createStackNavigator();

export default () => {
  const { isAuthenticated, token, authenticate, endSession } = useContext(SpotifyContext)

  const [getMe, { loading, data, error }] = useLazyQuery<getMeResponseType>(GET_ME, {
    variables: {
      accessToken: token
    },
    fetchPolicy: "no-cache"
  })

  useEffect(() => {
    if (isAuthenticated) {
      getMe()
    }
  }, [isAuthenticated])

  useEffect(() => {
    if(data){

    }
  }, [data])

  return (
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false
            }}
          >
            <Stack.Screen name="Home" component={Home} />
          </Stack.Navigator>
        </NavigationContainer>
  );
};