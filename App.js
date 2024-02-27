import { StatusBar } from 'expo-status-bar';
import SetupScreen from './screens/setup/SetupScreen';
import { NavigationContainer } from '@react-navigation/native';
import { COLORS, isDarkTheme } from './constants/colors';
import { useContext, useEffect } from 'react';
import UserPreferencesContextProvider, { UserPreferencesContext } from './store/userPreferencesContext.js';
import { SPINNER_STYLE } from './constants/globalStyles.js';
import MainScreen from './screens/MainScreen/MainScreen.js';
import Spinner from 'react-native-loading-spinner-overlay';
import * as SplashScreen from 'expo-splash-screen';
import PullupTestScreen from './screens/tests/PullupTestScreen.js';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync()

function Navigation() {
  const userPreferencesCtx = useContext(UserPreferencesContext)

  return <PullupTestScreen />
  return (
    <NavigationContainer theme={navigationTheme}>
      {userPreferencesCtx.preferences.hasCompletedSetup ? <MainScreen /> : <SetupScreen />}
    </NavigationContainer>
  )
}

function Root() {
  console.log('test' + process.env.TEST)
  const userPreferencesCtx = useContext(UserPreferencesContext)
  useEffect(() => {
    async function loadPreferences() {
      await userPreferencesCtx.loadPreferences()
      SplashScreen.hideAsync();
    }
    loadPreferences()
  }, []) 

  if(userPreferencesCtx.preferences)
    return <Navigation />
  else
    return <Spinner visible={true} {...SPINNER_STYLE} />
}

export default function App() {
  return (
    <>
      <StatusBar style={isDarkTheme ? 'light' : 'dark'} />
      <UserPreferencesContextProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Root />
        </GestureHandlerRootView>
      </UserPreferencesContextProvider>
    </>
  );
}

const navigationTheme = {
  dark: isDarkTheme,
  colors: {
    primary: COLORS.foreground.primary,
    background: COLORS.background.primary,
    card: COLORS.background.secondary,
    text: COLORS.foreground.primary,
    border: COLORS.background.seperator,
    notification: COLORS.foreground.primary
  }
}