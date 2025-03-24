import { Pressable, StyleSheet, View } from "react-native"
import Checkbox from 'expo-checkbox';
import StyledText from "./StyledText";

function StyledCheckbox({title, value, onValueChange, ...props}) {

  return (
    <Pressable style={[styles.containerStyle, {paddingVertical: 5}]} onPress={() => onValueChange(!value)}>
      <Checkbox value={value} {...props} />
      <StyledText>{title}</StyledText>
    </Pressable>
  )
}

export default StyledCheckbox

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center'
  }
})