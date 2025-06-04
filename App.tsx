import { StatusBar } from 'expo-status-bar';
import ComponentsShowcase from './components/ui/ComponentsShowcase';
import ThemeContextProvider from './context/ThemeContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Container from './components/ui/Container';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeContextProvider>
        <StatusBar style="auto" />
        <Container>
          <ComponentsShowcase />
        </Container>
      </ThemeContextProvider>
    </SafeAreaProvider>
  );
}

