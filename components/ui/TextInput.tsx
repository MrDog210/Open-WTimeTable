import { View, TextInput as TextInputRN, ViewStyle, StyleProp, TextInputProps, StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"

interface MyTextInputProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>,
}

function TextInput({ style, containerStyle, ...props }: MyTextInputProps) {
  const { colors, roundness } = useTheme()

  return (
    <View style={[{ backgroundColor: colors.surfaceVariant, borderRadius: roundness }, styles.containerStyle, containerStyle]}>
      <TextInputRN
        style={[{ color: colors.onBackground }, styles.textInput, style]}
        placeholderTextColor={colors.onSurfaceVariant}
        {...props}
      />
    </View>
  )
}

export default TextInput

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 16,
    outlineWidth: 0
  },
})
