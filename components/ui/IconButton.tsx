import { Pressable, Text, StyleSheet, StyleProp, ViewStyle } from "react-native"
import { useTheme } from "../../context/ThemeContext"
import { type ElementType } from "react"

type IconButtonProps = {
  title?: string,
  onPress: () => void,
  icon: ElementType,
  style?: StyleProp<ViewStyle>,
  iconColor?: string
  mode?: 'PRIMARY' | 'TRANSPARENT'
}

function IconButton({title, onPress, icon: Icon, style, iconColor, mode = 'PRIMARY'}: IconButtonProps) {
  const { colors } = useTheme()

  let bgColor: string
  let fgColor: string

  if(mode === "PRIMARY") {
    bgColor = colors.primary
    fgColor = colors.onPrimary
  } else {
    bgColor = "transparent"
    fgColor = colors.onBackground
  }

  return (
    <Pressable onPress={onPress} style={[{ backgroundColor: bgColor, alignItems: 'center' }, styles.container, style]} android_ripple={{color: colors.touchColor, foreground: true}}>
      <Icon size={25} color={iconColor || fgColor} />
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