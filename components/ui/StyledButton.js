import { Pressable, Text, StyleSheet, View } from "react-native"
import { COLORS } from "../../constants/colors"


function StyledButton({title, onPress, type, style}) {
  return (
  <Pressable onPress={onPress} style={styles.container} android_ripple={{color: COLORS.foreground.accentPressed}}>
    <Text style={[styles.text, style]}>{title}</Text>
  </Pressable>
  )
}

export default StyledButton

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.foreground.accent,
    padding: 10,
    alignContent: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    color: COLORS.background.primary
  }
})