import { Pressable, View, StyleSheet } from "react-native"
import { CustomLecture } from "../../types/types"
import Text from "../ui/Text"
import Divider from "../ui/Divider"
import { getTimeFromDate } from "../../util/dateUtils"
import { useTheme } from "../../context/ThemeContext"


type CustomCourseRowProps = {
  customCourse: CustomLecture,
  onPress: () => void,
  onLongPress: () => void
}

function CustomCourseRow({customCourse, onPress, onLongPress}: CustomCourseRowProps) {
  const { id, course, note, start_time, end_time, days_of_week, groups, lecturers, rooms} = customCourse
  const { colors } = useTheme()
  // TODO: fix styling
  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} android_ripple={{color: colors.touchColor }}>
      <View style={styles.containerStyle}>
        <View style={{flexDirection: 'row', gap: 10}}>
          <Text style={{fontWeight: 'bold'}}>{course}</Text>
          <Text>{`${getTimeFromDate(start_time)} - ${getTimeFromDate(end_time)}`}</Text>
          <Text>{rooms[0].name}</Text>
        </View>
        <Text>{lecturers[0].name}</Text>
        <Text style={{fontWeight: 'bold'}}>Days:</Text>
        <View style={{flexDirection: 'row', gap: 10}}>
          {days_of_week[0] && <Text>MON</Text>}
          {days_of_week[1] && <Text>TUE</Text>}
          {days_of_week[2] && <Text>WED</Text>}
          {days_of_week[3] && <Text>THU</Text>}
          {days_of_week[4] && <Text>FRI</Text>}
          {days_of_week[5] && <Text>SAT</Text>}
          {days_of_week[6] && <Text>SUN</Text>}
        </View>
      </View>
      <Divider style={{marginVertical: 0}} />
    </Pressable>
  )
}

export default CustomCourseRow

const styles = StyleSheet.create({
  containerStyle: {
    padding: 10
  }
})