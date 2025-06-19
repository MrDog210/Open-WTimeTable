import { useEffect, useState } from "react";
import { CustomLecture } from "../../types/types"
import uuid from 'react-native-uuid';
import Button from "../ui/Button";
import { View, StyleSheet, ScrollView } from "react-native";
import TextInput from "../ui/TextInput";
import Text from "../ui/Text";
import { getTimeFromDate } from "../../util/dateUtils";
import { useTheme } from "../../context/ThemeContext";
import DatePicker from "react-native-date-picker";
import DropDownPicker from "../ui/DropDownPicker";

const START_TIME = new Date()
START_TIME.setHours(10, 0, 0)
const END_TIME = new Date()
END_TIME.setHours(12, 0, 0)

const DEFAULT_VALUES: CustomLecture = {
  id: "",
  course: "",
  note: "",
  usersNote: {id: -1, note: ""},
  start_time: START_TIME.toISOString(),
  end_time: END_TIME.toISOString(),
  days_of_week: [false, false, false, false, false, false, false],
  groups: [{id: -1, name: ''}],
  lecturers: [{id: -1, name: ''}],
  rooms: [{id: -1, name: ''}],
}

type EditCustomLectureModalProps = {
  customCourse?: CustomLecture,
  onCancelPressed: () => void,
  onConfirmPressed: (cl: CustomLecture) => void
}

function EditCustomLectureModal({customCourse = undefined, onCancelPressed, onConfirmPressed}: EditCustomLectureModalProps) {
  const [course, setCourse] = useState<CustomLecture>(customCourse ? customCourse : DEFAULT_VALUES)
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<number[]>([]);
  const [items, setItems] = useState<{label: string, value: number}[]>([
    {label: 'Monday', value: 0},
    {label: 'Tuesday', value: 1},
    {label: 'Wednesday', value: 2},
    {label: 'Thursday', value: 3},
    {label: 'Friday', value: 4},
    {label: 'Saturday', value: 5},
    {label: 'Sunday', value: 6},
  ]);
  const { colors } = useTheme()

  function onChangeSelectedDays(days: number[]) {
    const selectedDays = [false, false, false, false, false, false, false]
    for(const day of days)
      selectedDays[day] = true
    setCourse({...course, days_of_week: selectedDays})
  }

  function syncDropdown() {
    const selectedDays: number[] = []
    for(let i = 0; i < 7; i++)
      if(course.days_of_week[i])
        selectedDays.push(i)
    setValue(selectedDays)
  }

  useEffect(() => {
    setCourse(customCourse ? customCourse : DEFAULT_VALUES)
    syncDropdown()
  }, [customCourse])

  return (
    <View style={{backgroundColor: colors.background, flex: 1}}>
      <ScrollView contentContainerStyle={{gap: 10}} style={styles.scrollView}>
        <Text>Course name</Text>
        <TextInput
          value={course.course}
          onChangeText={(value) => setCourse({...course, course: value})}
          placeholder={"Algebra 1"}
         />
        <Text>Lecturer</Text>
        <TextInput
          value={course.lecturers[0].name}
          onChangeText={(value) => setCourse({...course, lecturers: [{id: 0, name: value}]})}
          placeholder={"John Doe"}
        />
        <Text>Room</Text>
        <TextInput
          value={course.rooms[0].name}
          onChangeText={(value) => setCourse({...course, rooms: [{id: 0, name: value}]})}
          placeholder={"A-420"}
         />
        <Text>Note</Text>
        <TextInput
          value={course.note}
          onChangeText={(value) => setCourse({...course, note: value})}
          placeholder={"..."}
        />
        <Text>Users note</Text>
        <TextInput
          value={course.usersNote.note}
          onChangeText={(value) => setCourse({...course, usersNote: {id: 0, note: value}})}
          placeholder={"..."}
        />
        <Text>Days of week</Text>
        <DropDownPicker
          placeholder='Select days of week'
          multiple
          min={0}
          max={7}
          onChangeValue={onChangeSelectedDays as any}
          mode='BADGE'
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
        />
        <View style={styles.timePickerRow}>
          <View style={styles.timePickerContainer}>
            <Text>Start time</Text>
            <DatePicker style={styles.timePicker} date={new Date(course.start_time)} onDateChange={(newTime) => setCourse({...course, start_time: newTime.toISOString()})} mode="time" />
          </View>
          <View style={styles.timePickerContainer}>
            <Text>End time</Text>
            <DatePicker style={styles.timePicker} date={new Date(course.end_time)} onDateChange={(newTime) => setCourse({...course, end_time: newTime.toISOString()})} mode="time" />
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button containerStyle={{flex: 1}} mode="SECONDARY" onPress={() => onCancelPressed()}>Cancel</Button>
        <Button containerStyle={{flex: 1}} onPress={() => onConfirmPressed(!course.id ? {...course, id: uuid.v4()} : course)}>Confirm</Button>
      </View>
    </View>
  )
}

export default EditCustomLectureModal

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: 15,
    paddingTop: 15,
    gap: 10,
    columnGap: 10,
    rowGap: 10
  },
  daysContainer: {
    paddingTop: 8,
  },
  timePickerRow: {
    flexDirection: 'row'
  },
  timePickerContainer: {
    flex: 1,
    maxWidth: '50%',
    alignItems: 'center'
  },
  timePicker: {
    maxWidth: '100%'
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 10,
    paddingTop: 0,
    gap: 10
  }
})