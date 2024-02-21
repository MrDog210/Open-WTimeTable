import { Pressable, StyleSheet } from "react-native"
import { COLORS } from "../../../constants/colors"
import { OPTIONS_CONTAINER_STYLE } from "../../../constants/globalStyles"
import StyledText from "../StyledText"

function OptionsButton({title, onPress}) {
  return (
  <Pressable onPress={onPress} style={[styles.container, OPTIONS_CONTAINER_STYLE]} android_ripple={{color: COLORS.foreground.secondary}}>
    <StyledText style={styles.text}>{title}</StyledText>
  </Pressable>
  )
}

export default OptionsButton

const styles = StyleSheet.create({
  container: {
    alignContent: 'center',
    justifyContent: 'center',
  },
  text: {
    
  }
})