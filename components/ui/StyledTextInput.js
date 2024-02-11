import { TextInput, View, Text, StyleSheet } from "react-native"
import { COLORS } from "../../constants/colors"


function StyledTextInput({label, textInputOptions}) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput {...textInputOptions} style={styles.textInput} placeholderTextColor={COLORS.foreground.secondary} />
    </View>
  )
}

export default StyledTextInput

const styles = StyleSheet.create({
  container: {
    marginVertical: 2,
    marginHorizontal: 10
  },
  textInput: {
    backgroundColor: COLORS.background.secondary,
    borderWidth: 1,
    borderColor: COLORS.background.seperator,
    paddingHorizontal: 15,
    paddingVertical: 5,
    color: COLORS.foreground.primary,
  },
  label: {
    color: COLORS.foreground.primary,
    padding: 5
  }
})