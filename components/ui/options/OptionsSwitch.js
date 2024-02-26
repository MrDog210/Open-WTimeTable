import { StyleSheet, View } from "react-native"
import StyledText from "../StyledText"
import { Switch } from "react-native-gesture-handler"
import { OPTIONS_CONTAINER_STYLE } from "../../../constants/globalStyles"

function OptionsSwitch({title, value, onValueChange}) {
  return (
    <View style={[OPTIONS_CONTAINER_STYLE, styles.container]}>
      <StyledText style={styles.text}>{title}</StyledText>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  )
}

export default OptionsSwitch

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5
  },
  text: {
    flex: 1
  }
})