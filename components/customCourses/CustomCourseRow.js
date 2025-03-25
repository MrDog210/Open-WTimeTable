import StyledText from "../ui/StyledText"
import { Pressable, StyleSheet, View } from "react-native"
import { COLORS, isDarkTheme } from "../../constants/colors"
import { getTimeFromDate } from "../../util/dateUtils";
import Line from "../ui/Line";

function CustomCourseRow({customCourse, onPress, onLongPress}) {
  const { id, course, note, start_time, end_time, days_of_week, groups, lecturers, rooms} = customCourse

  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} android_ripple={{color: COLORS.foreground.accentPressed}}>
      <View style={styles.containerStyle}>
        <View style={{flexDirection: 'row', gap: 10}}>
          <StyledText style={{fontWeight: 'bold'}}>{course}</StyledText>
          <StyledText>{`${getTimeFromDate(start_time)} - ${getTimeFromDate(end_time)}`}</StyledText>
          <StyledText>{rooms[0]}</StyledText>
        </View>
        <StyledText>{lecturers[0]}</StyledText>
        <StyledText style={{fontWeight: 'bold'}}>Days:</StyledText>
        <View style={{flexDirection: 'row', gap: 10}}>
          {days_of_week[0] && <StyledText>MON</StyledText>}
          {days_of_week[1] && <StyledText>TUE</StyledText>}
          {days_of_week[2] && <StyledText>WED</StyledText>}
          {days_of_week[3] && <StyledText>THU</StyledText>}
          {days_of_week[4] && <StyledText>FRI</StyledText>}
          {days_of_week[5] && <StyledText>SAT</StyledText>}
          {days_of_week[6] && <StyledText>SUN</StyledText>}
        </View>
      </View>
      <Line style={{marginVertical: 0}} />
    </Pressable>
  )
}

export default CustomCourseRow

const styles = StyleSheet.create({
  containerStyle: {
    padding: 10
  }
})