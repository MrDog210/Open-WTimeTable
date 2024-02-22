import { StyleSheet, View } from "react-native"
import StyledText from "../ui/StyledText"

function TimeTableHeader({date, start, end}) {
  return (
    <View>
      <StyledText style={styles.title}>{date.toLocaleString('en-us', {  weekday: 'long' })}</StyledText>
      <StyledText style={styles.text}>{`${date.getDate()}.${date.getMonth()}`}</StyledText>
    </View>
  )
}

export default TimeTableHeader

const styles = StyleSheet.create({
  text: {
    textAlign: 'center'
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center'
  }
})