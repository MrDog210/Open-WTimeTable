import { StatusBar } from 'expo-status-bar';
import SetupScreen from './screens/setup/SetupScreen';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { COLORS, isDarkTheme } from './constants/colors';
import { useContext, useEffect } from 'react';
import UserPreferencesContextProvider, { UserPreferencesContext } from './store/userPreferencesContext.js';
import { SPINNER_STYLE } from './constants/globalStyles.js';
import MainScreen from './screens/MainScreen/MainScreen.js';
import Spinner from 'react-native-loading-spinner-overlay';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as NavigationBar from 'expo-navigation-bar';
import { View } from 'react-native';


import { Platform, Appearance } from 'react-native'

if (Platform.OS === 'web') {
  const rn = require('react-native')
  rn.PlatformColor = (color) => {
    console.warn('PlatformColor is not supported on web. Returning fallback color.')
    return color || '#000'
  }
}

SplashScreen.preventAutoHideAsync()

function Navigation() {
  const userPreferencesCtx = useContext(UserPreferencesContext)

  return (
    <NavigationContainer theme={navigationTheme}>
      {userPreferencesCtx.preferences.hasCompletedSetup ? <MainScreen /> : <SetupScreen />}
    </NavigationContainer>
  )
}

function Root() {
  const userPreferencesCtx = useContext(UserPreferencesContext)
  useEffect(() => {
    async function loadPreferences() {
      await userPreferencesCtx.loadPreferences()
      SplashScreen.hideAsync();
    }
    loadPreferences()

     NavigationBar.setBackgroundColorAsync('#000000')
     NavigationBar.setButtonStyleAsync('light')
  }, []) 

  if(userPreferencesCtx.preferences)
    return <Navigation />
  else
    return <Spinner visible={true} {...SPINNER_STYLE} />
}

export default function App() {
  return (
    <View style={{flex: 1, backgroundColor: COLORS.background.primary}}>
      <StatusBar  style={isDarkTheme ? 'light' : 'dark'} />
      <UserPreferencesContextProvider>
        <SafeAreaProvider>
          <SafeAreaView edges={["right", "bottom", "left"]} style={{flex: 1}}>
            <Root />
          </SafeAreaView>
        </SafeAreaProvider>
      </UserPreferencesContextProvider>
    </View>
  );
}

const navigationTheme = {
  dark: isDarkTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.foreground.primary,
    background: COLORS.background.primary,
    card: COLORS.background.secondary,
    text: COLORS.foreground.primary,
    border: COLORS.background.seperator,
    notification: COLORS.foreground.primary
  },
  fonts: {
    ...DefaultTheme.fonts,
  }
}