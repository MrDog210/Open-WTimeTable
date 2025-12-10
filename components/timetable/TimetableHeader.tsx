import { StyleSheet, View } from "react-native"
import Text from "../ui/Text"

type TimeTableHeaderProps = {
  date: Date
}

function TimeTableHeader({date}: TimeTableHeaderProps) {
  return (
    <View>
      <Text style={styles.title}>{date.toLocaleString('en-us', {  weekday: 'long' })}</Text>
      <Text style={styles.text}>{`${date.getDate()}.${date.getMonth() + 1}`}</Text>
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