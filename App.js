import { StatusBar } from 'expo-status-bar';
import SetupScreen from './screens/setup/SetupScreen';
import { NavigationContainer } from '@react-navigation/native';
import { COLORS, isDarkTheme } from './constants/colors';
import { useContext, useEffect } from 'react';
import UserPreferencesContextProvider, { PREF_KEYS, UserPreferencesContext } from './store/userPreferencesContext.js';
import { SPINNER_STYLE } from './constants/globalStyles.js';
import MainScreen from './screens/MainScreen/MainScreen.js';
import Spinner from 'react-native-loading-spinner-overlay';
import { Appearance } from 'react-native';

function Navigation() {
  const userPreferencesCtx = useContext(UserPreferencesContext)

  useEffect(() => {
    const selectedTheme = userPreferencesCtx.getKey(PREF_KEYS.darkMode)
    if(selectedTheme === 'auto')
      Appearance.setColorScheme(null)
    else
      Appearance.setColorScheme(selectedTheme)
  }, [userPreferencesCtx.preferences[PREF_KEYS.darkMode]])
  
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
      <StatusBar style="auto" />
      <UserPreferencesContextProvider>
          <Root />
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