import { StatusBar } from 'expo-status-bar';
import ThemeContextProvider, { useTheme } from './context/ThemeContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import UserSettingsContextProvider, { useSettings } from './context/UserSettingsContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStaticNavigation, DefaultTheme, StaticParamList, useNavigation } from '@react-navigation/native';
import SetupScreenNavigation from './screens/setup/SetupScreenNavigation';
import { onlineManager, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MainDrawer } from './screens/MainScreen/MainScreenNavigation';
import NetInfo from '@react-native-community/netinfo'
import GroupSelectScreen from './screens/setup/GroupSelectScreen';
import { NAVIGATION_STYLE } from './util/styling';

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
      screen: MainDrawer,
    },
    Setup: {
      if: useHasNotCompletedSetup,
      screen: SetupScreenNavigation,
    },
    GroupSelect: {
      screen: GroupSelectScreen,
      options: {
        title: 'Select groups for lectures',
        headerShown: true
      }
    }
  },
  screenOptions: {
    ...NAVIGATION_STYLE as any,
    headerShown: false,
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
  const {colors, theme} = useTheme()
  
  const myTheme: ReactNavigation.Theme = {
    ...DefaultTheme,
    dark: theme === 'dark',
    colors: {
      ...DefaultTheme.colors,
      background: colors.background,
      primary: colors.onBackground,
      //border: 'transparent',
      card: colors.surface,
      text: colors.onBackground
    }
  }

  return (
    <StaticNavigation theme={myTheme} />
  )
}

const queryClient = new QueryClient()

onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected)
  })
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <UserSettingsContextProvider>
          <ThemeContextProvider>
            <GestureHandlerRootView>
              <StatusBar style="auto" />
              <Navigation />
            </GestureHandlerRootView>
          </ThemeContextProvider>
        </UserSettingsContextProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

