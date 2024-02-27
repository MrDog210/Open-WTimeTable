import { StyleSheet, Text, View } from "react-native"
import PullUpCalendar from "../../components/PullUpCalendar/PullUpCalendar";
import { useState } from "react";

function PullupTestScreen() {
  const [date, setDate] = useState(new Date('2024-02-20'))
  return (
    <View style={styles.container}>
      <Text>{date.toISOString()}</Text>
      <PullUpCalendar date={date} setDate={setDate} />
    </View>
  )
}

export default PullupTestScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'grey',
  },
});