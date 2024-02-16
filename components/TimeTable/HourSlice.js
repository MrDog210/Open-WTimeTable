import { Pressable, StyleSheet, Text, View } from "react-native";
import { getTimeFromDate } from "../../util/dateUtils";
import { COLORS } from "../../constants/colors";
import { formatArray } from "../../util/timetableUtils";

function HourSlice({style, item, dayIndex, daysTotal, onPress}) {
  const {course, eventType, start_time, end_time, note, showLink, color, colorText, rooms, groups, lecturers, executionType} = item.lecture
  //console.log(JSON.stringify(item.lecture))
  const hexColor = (color === null || color === '') ? COLORS.foreground.primary : `#${color}`
  function onPressed() {
    onPress(item.lecture)
  }
  return (
    <Pressable style={style} onPress={onPressed}>
      <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.courseName}>{course ? course : eventType}</Text>
            <Text>{executionType}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.timeText}>{`${getTimeFromDate(start_time)} - ${getTimeFromDate(end_time)}`}</Text>
            <Text>{formatArray(rooms, 'name')}</Text>
            <Text>{formatArray(lecturers, 'name')}</Text>
          </View>
          <View>
            <Text style={{color: hexColor, textAlign:'right'}}>{colorText}</Text>
          </View>
      </View>
    </Pressable>
    
);
}

export default HourSlice

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  timeText: {
    fontSize: 13
  },
  detailsContainer: {
    flex: 1
  },
  bottomContainer: {
  }

})