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
  const {course, eventType, start_time, end_time, note, showLink, color, colorText, rooms, groups, lecturers} = item.lecture
  //console.log(JSON.stringify(item.lecture))
  return (
    <View style={[style,styles.container]}>
        <Text>{course ? course : eventType}</Text>
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
    padding: 5
  }
})