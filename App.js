import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import SetupScreen from './screens/setup/SetupScreen';
import { NavigationContainer } from '@react-navigation/native';
import { COLORS } from './constants/colors';

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer theme={navigationTheme}>
        <SetupScreen />
      </NavigationContainer>
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