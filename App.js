import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import SetupScreen from './screens/setup/SetupScreen';

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <SetupScreen />
    </>
  );
}

const styles = StyleSheet.create({
});
