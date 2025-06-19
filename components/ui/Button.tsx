import { PressableProps, Pressable, type StyleProp, StyleSheet, View, type ViewStyle, ActivityIndicator, GestureResponderEvent } from "react-native"
import Text from "./Text"
import { type ReactNode } from "react"
import { useTheme } from "../../context/ThemeContext"

interface MyButtonProps extends PressableProps {
  mode?: "PRIMARY" | "SECONDARY" | "WARNING" | "TRANSPARENT",
  children?: ReactNode,
  style?: StyleProp<ViewStyle>,
  containerStyle?: StyleProp<ViewStyle>,
  loading?: boolean,
  disabled?: boolean
}

function Button({style, mode = "PRIMARY", children, containerStyle, loading = false, disabled = false, onPress, ...props}: MyButtonProps) {
  const {colors} = useTheme()
  let bgColor: string
  let fgColor: string

  if(mode === "PRIMARY") {
    bgColor = colors.primary
    fgColor = colors.onPrimary
  } else if (mode === "SECONDARY") {
    bgColor = colors.secondary
    fgColor = colors.onSecondary
  } else if (mode === "WARNING") {
    bgColor = colors.error
    fgColor = colors.onError
  } else {
    bgColor = "transparent"
    fgColor = colors.onBackground
  }

  function myOnPresss(event: GestureResponderEvent) {
    if(!disabled && onPress)
      onPress(event)
  }
  
  return (
    <View style={[{ backgroundColor: bgColor }, styles.containerStyle, containerStyle]}>
      <Pressable style={[styles.buttonStyle, style, { backgroundColor: disabled ? colors.surfaceDisabled : undefined }]} onPress={myOnPresss} {...props} android_ripple={{color: disabled ? undefined : colors.touchColor}}>
        {
          loading && <ActivityIndicator color={fgColor} />
        }
        <Text style={{color: fgColor}} selectable={false}>{children}</Text>
      </Pressable>
    </View>
  )
}

export default Button

const styles = StyleSheet.create({
  containerStyle: {
    borderRadius: 10,//15,
    overflow: 'hidden',
  },
  buttonStyle: {
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 16,
    flexDirection: 'row',
    gap: 8
  }
})