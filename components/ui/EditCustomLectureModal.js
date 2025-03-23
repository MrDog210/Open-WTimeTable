import { useEffect, useState } from "react"
import Dialog from "react-native-dialog";
import { COLORS } from "../../constants/colors";
import { View, ScrollView, StyleSheet } from "react-native";
import StyledButton from "./StyledButton";
import StyledTextInput from "./StyledTextInput"

const DEFAULT_VALUES = {
  course: "",
  start_time: new Date(),
  end_time: new Date(),
  days_of_week: [],
  groups: [""],
  lecturers: [""],
  rooms: [""]
}

function EditCustomLectureModal({customCourse = undefined, onCancelPressed, onConfirmPressed}) {
  const [course, setCourse] = useState(customCourse ? customCourse : DEFAULT_VALUES)

  function confirm() {
    onRequestConfirm(course)
  }

  useEffect(() => {
    setCourse(customCourse ? customCourse : DEFAULT_VALUES)
  }, [customCourse])

  return (
    <View style={{backgroundColor: COLORS.background.primary, flex: 1}}>
      <ScrollView style={[{flex: 1}, styles.scrollView]}>
        <StyledTextInput label="Course name" textInputOptions={{
          value: course.course,
          onChangeText: (value) => setCourse({...course, course: value}),
          placeholder: "Algebra 1"
        }} />
        <StyledTextInput label="Lecturer" textInputOptions={{
          value: course.lecturers[0],
          onChangeText: (value) => setCourse({...course, lecturers: [value]}),
          placeholder: "John Doe"
        }} />
        <StyledTextInput label="Room" textInputOptions={{
          value: course.rooms[0],
          onChangeText: (value) => setCourse({...course, rooms: [value]}),
          placeholder: "A-420"
        }} />
      </ScrollView>
      <View style={{flexDirection: 'row'}}>
        <StyledButton containerStyle={{flex: 1}} title="Cancel" onPress={() => onCancelPressed()}/>
        <StyledButton containerStyle={{flex: 1}} title="Confirm" onPress={onConfirmPressed} />
      </View>
    </View>
  )
}

export default EditCustomLectureModal

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 16
  }
})