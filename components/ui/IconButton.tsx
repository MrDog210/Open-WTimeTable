import { Pressable, Text, StyleSheet, StyleProp, ViewStyle } from "react-native"
import { useTheme } from "../../context/ThemeContext"
import { type ElementType } from "react"

type IconButtonProps = {
  title?: string,
  onPress: () => void,
  icon: ElementType,
  style?: StyleProp<ViewStyle>,
  iconColor?: string
}

function IconButton({title, onPress, icon: Icon, style, iconColor}: IconButtonProps) {
  const { colors } = useTheme()

  return (
    <Pressable onPress={onPress} style={[{ backgroundColor: colors.primary }, styles.container, style]} android_ripple={{color: colors.touchColor}}>
      <Icon size={25} color={iconColor || colors.onPrimary} />
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