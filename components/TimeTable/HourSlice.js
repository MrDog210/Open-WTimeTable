import { StyleSheet, Text, View } from "react-native";
import { getTimeFromDate } from "../../util/dateUtils";
import { COLORS } from "../../constants/colors";

function formatArray(array, key) {
  let string = ''
  for(let i = 0; i<array.length; i++)
    string += array[i][key] +((i !== array.length -1) ? ', ' : '')

  return string
}

function HourSlice({style, item, dayIndex, daysTotal}) {
  const {course, eventType, start_time, end_time, note, showLink, color, colorText, rooms, groups, lecturers, executionType} = item.lecture
  //console.log(JSON.stringify(item.lecture))
  return (
    <View style={[style,styles.container]}>
        <View style={styles.titleContainer}>
          <Text style={styles.courseName}>{course ? course : eventType}</Text>
          <Text>{executionType}</Text>
        </View>
        <Text>{`${getTimeFromDate(start_time)} - ${getTimeFromDate(end_time)}`}</Text>
        <Text>{formatArray(rooms, 'name')}</Text>
        <Text>{formatArray(lecturers, 'name')}</Text>
    </View>
);
}

export default HourSlice

const styles = StyleSheet.create({
  container: {
    //elevation: 5,
    backgroundColor: COLORS.background.primary,
    borderWidth: 1,
    borderColor: COLORS.background.seperator,
    padding: 5,
    overflow: 'hidden'
  },
  titleContainer: {
    flexDirection: 'row'
  },
  courseName: {
    flexGrow: 10,
    fontWeight: 'bold'
  }
})