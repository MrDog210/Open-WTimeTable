import StyledText from "../ui/StyledText"
import { Pressable, View } from "react-native"
import { COLORS, isDarkTheme } from "../../constants/colors"

function CustomCourseRow({customCourse, onPress, onLongPress}) {
  const { id, course, note, start_time, end_time, days_of_week, groups, lecturers, rooms} = customCourse

  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} android_ripple={{color: COLORS.foreground.accentPressed}}>
      <StyledText>{course}</StyledText>
    </Pressable>
  )
}

export default CustomCourseRow