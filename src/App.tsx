import React, { useEffect } from 'react';

import SplashScreen from 'react-native-splash-screen'
import WithSongChangeListener from './HOCs/WithSongChangeListener'
import { ApolloProvider } from '@apollo/react-hooks';
import { SpotifyContextProvider } from "./spotify/spotifyContext"
import client from "./graphql"
import { playSilentTrack, stopSilentTrack } from './utils/backgroundTask'
import Routes from "./screens"

declare const global: { HermesInternal: null | {} };


const ScreensWithBackgroundEvents = WithSongChangeListener(Routes)

const App = () => {
  useEffect(() => {
    // fetch user key
    SplashScreen.hide()
    playSilentTrack()
    return () => {
      stopSilentTrack()
    }
  }, [])

  return (
    <ApolloProvider client={client}>
      <SpotifyContextProvider>
        <ScreensWithBackgroundEvents />
      </SpotifyContextProvider>
    </ApolloProvider>
  );
};

export default App;
