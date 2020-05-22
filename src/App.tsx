import React, { useEffect } from 'react';

import SplashScreen from 'react-native-splash-screen'

import { ApolloProvider } from '@apollo/react-hooks';
import { SpotifyContextProvider } from "./spotify/spotifyContext"
import client from "./graphql"

import Routes from "./screens"
declare const global: { HermesInternal: null | {} };

const App = () => {

  useEffect(() => {
    // fetch user key
    SplashScreen.hide()
  }, [])

  return (
    <ApolloProvider client={client}>
      <SpotifyContextProvider>
        <Routes />
      </SpotifyContextProvider>
    </ApolloProvider>
  );
};

export default App;
