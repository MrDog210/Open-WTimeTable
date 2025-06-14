import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import UserSettingsContextProvider, { useSettings } from './context/UserSettingsContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TimeTableScreen from './screens/MainScreen/TimeTableScreen';
import { createStaticNavigation, DefaultTheme as DefaultThemeNavigation, StaticParamList } from '@react-navigation/native';
import SetupScreenNavigation from './screens/setup/SetupScreenNavigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DefaultTheme as DefaultThemePaper, MD3Theme, PaperProvider, useTheme } from 'react-native-paper';

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
    headerShown: false,
  },
  
});

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

const StaticNavigation = createStaticNavigation(RootStack);

const theme: MD3Theme = {
  ...DefaultThemePaper,
  roundness: 10
}


function Navigation() {
  const {isLoading} = useSettings()
  const {colors} = useTheme()

  const myTheme: ReactNavigation.Theme = {
    ...DefaultThemeNavigation,
    //dark: theme === 'dark',
    colors: {
      ...DefaultThemeNavigation.colors,
      background: colors.background,
      primary: colors.onBackground,
      border: 'transparent',
      card: 'transparent',
      text: colors.onBackground,
      
    }
  }

  if (isLoading)
    return <></>

  return (
    <StaticNavigation theme={myTheme} />
  )
}

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <UserSettingsContextProvider>
          <PaperProvider theme={theme}>
            <StatusBar style="auto" />
            <Navigation />
          </PaperProvider>
        </UserSettingsContextProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

