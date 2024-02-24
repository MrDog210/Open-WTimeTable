import { View, Text, StyleSheet } from "react-native"
import { COLORS } from "../../constants/colors"

function Title({children, style}) {
  return (
    <View>
      <Text style={[styles.text, style]}>{children}</Text>
    </View>
  )
}

export default Title

const styles = StyleSheet.create({
  text: {
    fontWeight: 'bold',
    fontSize: 20,
    color: COLORS.foreground.primary,
  }
})