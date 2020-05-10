import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from 'react-native-splash-screen'


import Home from "./screens/Home"
import Login from "./screens/Login"

declare const global: { HermesInternal: null | {} };

const Stack = createStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true)
  useEffect(() => {
    // fetch user key
    setIsLoggedIn(true)
    SplashScreen.hide()
  }, [])

  return (
    <SafeAreaView style={styles.safeArea}>
      <NavigationContainer>
        {isLoggedIn ? (
          <Stack.Navigator
            screenOptions={{
              headerShown: false
            }}
          >
            <Stack.Screen name="Home" component={Home} />
          </Stack.Navigator>
        ) : (
            <Stack.Navigator
              screenOptions={{
                headerShown: false
              }}
            >
              <Stack.Screen name="Login" component={Login} />
            </Stack.Navigator>
          )}
      </NavigationContainer>
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  }
});

export default App;
