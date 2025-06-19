import { View, TextInput as TextInputRN, ViewStyle, StyleProp, TextInputProps, StyleSheet } from "react-native"
import { useTheme } from "../../context/ThemeContext"

interface MyTextInputProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>,
}

function TextInput({ style, containerStyle, ...props }: MyTextInputProps) {
  const { colors } = useTheme()

  return (
    <View style={[{ backgroundColor: colors.surface }, styles.containerStyle, containerStyle]}>
      <TextInputRN
        style={[{ color: colors.onBackground }, styles.textInput, style]}
        placeholderTextColor={colors.onSurface}
        {...props}
      />
    </View>
  )
}

export default TextInput

const styles = StyleSheet.create({
  containerStyle: {
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    minHeight: 55
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 16,
    outlineWidth: 0
  },
})
