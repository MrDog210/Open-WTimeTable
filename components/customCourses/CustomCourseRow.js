import StyledText from "../ui/StyledText"
import { Pressable, View } from "react-native"

function CustomCourseRow({customCourse, onPress, onLongPress}) {
  const { id, course, note, start_time, end_time, days_of_week, groups, lecturers, rooms} = customCourse
  console.log("Rendering ", course)
  return (
    <Pressable onPress={onPress} onLongPress={onLongPress}>
      <StyledText>{course}</StyledText>
    </Pressable>
  )
}

export default CustomCourseRow