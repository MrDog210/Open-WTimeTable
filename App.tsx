import { StatusBar } from 'expo-status-bar';
import ComponentsShowcase from './components/ui/ComponentsShowcase';
import ThemeContextProvider from './context/ThemeContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Container from './components/ui/Container';
import UserSettingsContextProvider, { useSettings } from './context/UserSettingsContext';
import { useMemo } from 'react';
import SchoolCodeInputScreen from './screens/setup/SchoolCodeInputScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TimeTableScreen from './screens/MainScreen/TimeTableScreen';
import { createStaticNavigation, StaticParamList } from '@react-navigation/native';
import SetupScreenNavigation from './screens/setup/SetupScreenNavigation';

function useHasCompletedSetup() {
  const {hasCompletedSetup} = useSettings()
  return hasCompletedSetup
}

function useHasNotCompletedSetup() {
  return !useHasCompletedSetup()
}

const RootStack = createNativeStackNavigator({
  screens: {
    Home: {
      if: useHasCompletedSetup,
      screen: TimeTableScreen,
    },
    Setup: {
      if: useHasNotCompletedSetup,
      screen: SetupScreenNavigation,
      options: {
        title: 'Sign in',
      },
    },
  },
  screenOptions: {
    headerShown: false
  }
});

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

const StaticNavigation = createStaticNavigation(RootStack);

function Navigation() {
 const {isLoading} = useSettings()

  if (isLoading)
    return <></>

  return (
    <StaticNavigation />
  )
}

export default function App() {
  return (
    <SafeAreaProvider>
      <UserSettingsContextProvider>
        <ThemeContextProvider>
          <StatusBar style="auto" />
          <Navigation />
        </ThemeContextProvider>
      </UserSettingsContextProvider>
    </SafeAreaProvider>
  );
}

