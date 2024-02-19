import { Pressable, StyleSheet, Text, View } from "react-native";
import { getTimeFromDate } from "../../util/dateUtils";
import { COLORS } from "../../constants/colors";
import { formatArray } from "../../util/timetableUtils";
import StyledText from "../ui/StyledText";

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
            <StyledText style={styles.courseName}>{course ? course : eventType}</StyledText>
            <StyledText>{executionType}</StyledText>
          </View>
          <View style={styles.detailsContainer}>
            <StyledText style={styles.timeText}>{`${getTimeFromDate(start_time)} - ${getTimeFromDate(end_time)}`}</StyledText>
            <StyledText>{formatArray(rooms, 'name')}</StyledText>
            <StyledText>{formatArray(lecturers, 'name')}</StyledText>
          </View>
          <View>
            <StyledText style={{color: hexColor, textAlign:'right'}}>{colorText}</StyledText>
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