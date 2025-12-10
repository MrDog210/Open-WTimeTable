import { PressableProps, Pressable, type StyleProp, StyleSheet, View, type ViewStyle, GestureResponderEvent } from "react-native"
import Text from "../ui/Text"
import { type ReactNode } from "react"
import { useTheme } from "../../context/ThemeContext"
import { ArrowRight } from "lucide-react-native";


interface MyButtonProps extends PressableProps {
  children?: ReactNode,
  style?: StyleProp<ViewStyle>,
  containerStyle?: StyleProp<ViewStyle>,
  disabled?: boolean,
}

function SettingsButton({style, children, containerStyle, disabled = false, onPress, ...props}: MyButtonProps) {
  const {colors} = useTheme()

  function myOnPresss(event: GestureResponderEvent) {
    if(!disabled && onPress)
      onPress(event)
  }
  
  return (
    <View style={[{ backgroundColor: "transparent" }, styles.containerStyle, containerStyle]}>
      <Pressable style={[styles.buttonStyle, style, { backgroundColor: disabled ? colors.surfaceDisabled : undefined }]} onPress={myOnPresss} {...props} android_ripple={{color: disabled ? undefined : colors.touchColor}}>
        <Text style={{color: colors.onBackground, flex: 1}} selectable={false}>{children}</Text>
        <ArrowRight size={24} color={colors.onBackground} />
      </Pressable>
    </View>
  )
}

export default SettingsButton

const styles = StyleSheet.create({
  containerStyle: {
    borderRadius: 10,//15,
    overflow: 'hidden',
  },
  buttonStyle: {
    alignItems: 'center',
    paddingVertical: 16,
    flexDirection: 'row',
    gap: 8
  }
})