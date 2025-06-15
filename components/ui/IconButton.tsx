import { Pressable, Text, StyleSheet, StyleProp, ViewStyle } from "react-native"
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from "../../context/ThemeContext"

type IconButtonProps = {
  title?: string,
  onPress: () => void,
  name: keyof typeof Ionicons.glyphMap,
  style?: StyleProp<ViewStyle>
}

function IconButton({title, onPress, name, style}: IconButtonProps) {
  const { colors } = useTheme()

  return (
    <Pressable onPress={onPress} style={[styles.container, style]} android_ripple={{color: 'transparent'}}>
      <Ionicons name={name} size={25} color={colors.onBackground} />
      {title && <Text style={styles.text}>{title}</Text>}
    </Pressable>
  )
}

export default IconButton

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  text: {
    textAlign: 'center',
  }
})