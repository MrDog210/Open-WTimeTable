import { BlurView } from "expo-blur";
import { ActivityIndicator, StyleSheet } from "react-native";
import Text from "./Text";
import { useTheme } from "../../context/ThemeContext";

type LoadingOverlayProps = {
  visible: boolean,
  text?: string
}

function LoadingOverlay({ visible, text }: LoadingOverlayProps) {
  const { colors } = useTheme()
  // TODO: animate intensity with reanimated
  if(!visible)
    return <></>
  
  return (
    <BlurView experimentalBlurMethod='dimezisBlurView' intensity={25} style={styles.background}>
      <ActivityIndicator size={64} color={colors.onBackground} />
      <Text style={styles.text} >{text}</Text>
    </BlurView>
  )
}

export default LoadingOverlay

const styles = StyleSheet.create({
  background: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 10000
  },
  text: {
    maxWidth: '75%',
    textAlign: 'center'
  }
})