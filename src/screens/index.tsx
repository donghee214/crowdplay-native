import React, { useEffect, useContext } from 'react';

import { NavigationContainer, RouteProp, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Settings from './Settings'
import Home from "./Home"
import VotingRoom from "./VotingRoom"
import ExpandedModal from './ExpandedModal'
import SearchScreen from './SearchScreen'
import withToast from '../HOCs/WithToast'

import { GET_ME } from "../graphql/queries"
import { useApolloClient } from '@apollo/react-hooks'
import { User, Image } from "../types"
import { TILE_TYPES } from "../components/VotingRoom/MusicTile"

import SpotifyContext from "../spotify/spotifyContext"
import colors from '../assets/colors';
import SearchIcon from '../assets/components/SearchIcon'
import MusicQueue from '../assets/components/MusicQueue'

export interface getMeResponseType {
  me: User
}

type RootStackParamList = {
  Home: undefined;
  VotingRoom: undefined;
  ExpandedModal: {
    roomId: string
    id: string
    primaryLabel: string
    secondaryLabel: string
    image: string
    href: string
    type: TILE_TYPES
    album: {
      images: Image
    }
  },
  Settings: {
    me: User
  }
};

export type HomeRouteProps = RouteProp<RootStackParamList, 'Home'>;
export type VotingRoomRouteProps = RouteProp<RootStackParamList, 'VotingRoom'>;
export type ExpandedModalRouteProps = RouteProp<RootStackParamList, 'ExpandedModal'>;
export type SettingsRouteProps = RouteProp<RootStackParamList, 'Settings'>;

const AppStack = createStackNavigator<RootStackParamList>();
const SearchStack = createStackNavigator()
const VotingRoomStack = createStackNavigator()
const HomeStack = createStackNavigator();
const Tab = createBottomTabNavigator()

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.white
  },
};


const SearchStackScreen = () => (
  <SearchStack.Navigator screenOptions={{ headerShown: false }}>
    <SearchStack.Screen name="SearchScreen" component={SearchScreen} />
    <SearchStack.Screen name="ExpandedModal" component={ExpandedModal} />
  </SearchStack.Navigator>
)

const VotingRoomStackScreen = () => (
  <VotingRoomStack.Navigator screenOptions={{ headerShown: false }}>
    <VotingRoomStack.Screen name="VotingRoom" component={VotingRoom} />
  </VotingRoomStack.Navigator>
)

const HomeStackScreen = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen name="Home" component={Home} options={{ headerShown: false }} />
    <HomeStack.Screen name="Settings" component={Settings} />
  </HomeStack.Navigator>
)

const AppTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        switch (route.name) {
          case ("Room"):
            return <MusicQueue fill={focused ? colors.green : colors.lightGrey} />
          case ("Add Song"):
            return <SearchIcon fill={focused ? colors.green : colors.lightGrey} isSmall={true} />
        }
      },
    })}
    tabBarOptions={{
      activeTintColor: colors.green,
      inactiveTintColor: colors.lightGrey,
      labelStyle: {
        marginTop: -6
      }
    }}
  >
    <Tab.Screen name="Room" component={VotingRoomStackScreen} />
    <Tab.Screen name="Add Song" component={SearchStackScreen} />
  </Tab.Navigator>
)

const Screens = () => {
  const client = useApolloClient()
  const { token, withRenew } = useContext(SpotifyContext)

  const getMe = async () => {
    // call the result so future calls can get this from cache
    await client.query({
      query: GET_ME,
      variables: {
        accessToken: token
      },
      fetchPolicy: "network-only",
      errorPolicy: 'none'
    })
  }


  useEffect(() => {
    if (token) {
      withRenew(getMe)
    }
  }, [token])

  return (
    <NavigationContainer theme={theme}>
      <AppStack.Navigator screenOptions={{ headerShown: false }}>
        <AppStack.Screen name="Home" component={HomeStackScreen} />
        <AppStack.Screen name="VotingRoom" component={AppTabs} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default withToast(Screens)