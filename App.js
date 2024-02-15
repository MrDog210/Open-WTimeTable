import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import SetupScreen from './screens/setup/SetupScreen';
import { NavigationContainer } from '@react-navigation/native';
import { COLORS } from './constants/colors';
import { useContext, useEffect } from 'react';
import UserPreferencesContextProvider, { UserPreferencesContext } from './store/userPreferencesContext.js';
import { SPINNER_STYLE } from './constants/globalStyles.js';
import MainScreen from './screens/MainScreen/MainScreen.js';
import Spinner from 'react-native-loading-spinner-overlay';

function Navigation() {
  const userPreferencesCtx = useContext(UserPreferencesContext)
  
  if(userPreferencesCtx.preferences) {
    console.log('Loading screen ' + userPreferencesCtx.preferences.hasCompletedSetup)
    return (
    <NavigationContainer theme={navigationTheme}>
      {userPreferencesCtx.preferences.hasCompletedSetup ? <MainScreen /> : <SetupScreen />}
    </NavigationContainer>)
  } else {
    return <Spinner visible={true} {...SPINNER_STYLE} />
  }
}

function Root() {
  const userPreferencesCtx = useContext(UserPreferencesContext)
  useEffect(() => {
    async function loadPreferences() {
      await userPreferencesCtx.loadPreferences()
    }
    loadPreferences()
  }, []) 

  return <Navigation />
}

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <UserPreferencesContextProvider>
          <Root />
      </UserPreferencesContextProvider>
    </>
  );
}

const styles = StyleSheet.create({
});

const navigationTheme = {
  dark: false,
  colors: {
    primary: COLORS.foreground.primary,
    background: COLORS.background.primary,
    card: COLORS.background.secondary,
    text: COLORS.foreground.primary,
    border: COLORS.background.seperator,
    notification: COLORS.foreground.primary
  }
}