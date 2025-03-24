import { useEffect, useState } from "react"
import { COLORS } from "../../constants/colors";
import { View, ScrollView, StyleSheet } from "react-native";
import StyledButton from "./StyledButton";
import StyledTextInput from "./StyledTextInput"
import StyledCheckbox from "./StyledCheckbox";
import StyledText from "./StyledText";
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import { getTimeFromDate } from "../../util/dateUtils";
import uuid from 'react-native-uuid';

const DEFAULT_VALUES = {
  id: undefined,
  course: "",
  note: "",
  start_time: new Date(),
  end_time: new Date(),
  days_of_week: [false, false, false, false, false, false, false],
  groups: [""],
  lecturers: [""],
  rooms: [""]
}

function EditCustomLectureModal({customCourse = undefined, onCancelPressed, onConfirmPressed}) {
  const [course, setCourse] = useState(customCourse ? customCourse : DEFAULT_VALUES)

  function setDayValue(day, value) {
    const arr = Array.from(course.days_of_week)
    arr[day] = value
    setCourse({...course, days_of_week: arr})
  }

  const showStartTime = () => {
    DateTimePickerAndroid.open({
      value: new Date(course.start_time),
      onChange: (_, d) => setCourse({...course, start_time: d}),
      mode: "time",
      is24Hour: true,
    });
  };

  const showEndTime = () => {
    DateTimePickerAndroid.open({
      value: new Date(course.end_time),
      onChange: (_, d) => setCourse({...course, end_time: d}),
      mode: "time",
      is24Hour: true,
    });
  };

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
        <StyledTextInput label="Note" textInputOptions={{
          value: course.note,
          onChangeText: (value) => setCourse({...course, note: value}),
          placeholder: "..."
        }} />
        <StyledButton title={`Set start time: ${getTimeFromDate(course.start_time)}`} containerStyle={{marginVertical: 4}} onPress={showStartTime}/>
        <StyledButton title={`Set end time: ${getTimeFromDate(course.end_time)}`} containerStyle={{marginVertical: 4}}  onPress={showEndTime}/>
        <View style={styles.daysContainer}>
          <StyledText>Select the occuring days: </StyledText>
          <StyledCheckbox 
            title={"Monday"} 
            value={course.days_of_week[0]} 
            onValueChange={v => setDayValue(0, v)} 
          />
          <StyledCheckbox 
            title={"Tuesday"} 
            value={course.days_of_week[1]} 
            onValueChange={v => setDayValue(1, v)} 
          />
          <StyledCheckbox 
            title={"Wednesday"} 
            value={course.days_of_week[2]} 
            onValueChange={v => setDayValue(2, v)} 
          />
          <StyledCheckbox 
            title={"Thursday"} 
            value={course.days_of_week[3]} 
            onValueChange={v => setDayValue(3, v)}  
          />
          <StyledCheckbox 
            title={"Friday"} 
            value={course.days_of_week[4]} 
            onValueChange={v => setDayValue(4, v)} 
          />
        </View>
      </ScrollView>
      <View style={{flexDirection: 'row'}}>
        <StyledButton containerStyle={{flex: 1}} title="Cancel" onPress={() => onCancelPressed()} isWarning />
        <StyledButton containerStyle={{flex: 1}} title="Confirm" onPress={() => onConfirmPressed(!course.id ? {...course, id: uuid.v4()} : course)} />
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
  },
  daysContainer: {
    paddingTop: 8,
  }
})