import { Pressable, Text, StyleSheet, View } from "react-native"
import { COLORS } from "../../constants/colors"
import { Ionicons } from '@expo/vector-icons'

function IconButton({title, onPress, name, style}) {
  return (
  <Pressable onPress={onPress} style={[styles.container, style]} android_ripple={{color: COLORS.foreground.accentPressed}}>
    <Ionicons name={name} size={18} color={COLORS.foreground.primary} />
    {title && <Text style={styles.text}>{title}</Text>}
  </Pressable>
  )
}

export default IconButton

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.foreground.accent,
    padding: 10,
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  text: {
    textAlign: 'center',
    color: COLORS.background.primary
  }
})