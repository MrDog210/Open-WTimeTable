import { Pressable, Text, StyleSheet, View } from "react-native"
import { COLORS, isDarkTheme } from "../../constants/colors"

function StyledButton({title, onPress, isWarning = false, style, containerStyle}) {
  return (
  <Pressable onPress={onPress} style={[styles.container, isWarning && styles.warning, containerStyle]} android_ripple={{color: COLORS.foreground.accentPressed}}>
    <Text style={[styles.text, style]}>{title}</Text>
  </Pressable>
  )
}

export default StyledButton

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.foreground.accent,
    padding: 15,
    alignContent: 'center',
    justifyContent: 'center',
  },
  warning: {
    backgroundColor: COLORS.foreground.warning,
  },
  text: {
    textAlign: 'center',
    color: isDarkTheme ? COLORS.foreground.primary : COLORS.background.primary
  }
})