import { StyleSheet, Text } from "react-native";
import { COLORS } from "../../constants/colors";

function StyledText({children, style}) {
  return <Text style={[styles.text, style]}>{children}</Text>
}

export default StyledText

const styles = StyleSheet.create({
  text: {
    color: COLORS.foreground.primary
  }
})