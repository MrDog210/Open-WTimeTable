import { Modal, ScrollView, StyleSheet, View } from "react-native";
import { COLORS } from "../../constants/colors";
import StyledButton from "../ui/StyledButton";
import { getTimeFromDate } from "../../util/dateUtils";
import { formatArray } from "../../util/timetableUtils";
import ContentCard from "../ui/ContentCard";
import StyledText from "../ui/StyledText";
import Line from "../ui/Line";
import Animated, { Easing, useSharedValue, withTiming } from "react-native-reanimated";
import { useEffect, useState } from "react";
import InputDialogue from "../ui/InputDialogue";
import { setNoteForCourse } from "../../util/database";

function LectureDetails({modalVisible, onRequestClose, lecture}) {
  // ANIMATIONS
  const opacity = useSharedValue(0)
  const top = useSharedValue(50)
  useEffect(() => {
    const isVisible = modalVisible ? 1 : 0
    opacity.value = withTiming(isVisible, {duration: 300})
    top.value =  withTiming(isVisible ? 0 : 50, {duration: 300, easing: Easing.inOut(Easing.poly(2))})
  }, [modalVisible])

  // OUTPUT
  const {course, course_id, eventType, start_time, end_time, note, showLink, color, colorText, rooms, groups, lecturers, executionType, executionType_id, usersNote} = lecture ?? {}
  const [customNote, setCustomNote] = useState(usersNote ? usersNote.note : undefined)

  function updateCustomNote(newCustomNote) {
    setNoteForCourse(newCustomNote, course_id, executionType_id)
    setCustomNote(newCustomNote)
  }

  useEffect(() => {
    if(!lecture)
      return
    setCustomNote(usersNote ? usersNote.note : undefined)
  }, [lecture])

  if(lecture === null)
    return

  return (
    <Modal visible={modalVisible} transparent={true} animationType="none" onRequestClose={onRequestClose}>
      <Animated.View style={[styles.container, {opacity}]}>
        <Animated.View style={[styles.centeredContainer, {top}]}>
          <View style={styles.titleContainer}>
            <StyledText style={styles.title}>{course ? course : eventType}</StyledText>
          </View>
          <Line style={styles.line}/>
          <ScrollView style={styles.contentsContainer}>
            <View style={styles.subtitle}>
              <StyledText>{`${getTimeFromDate(start_time)} - ${getTimeFromDate(end_time)}`}</StyledText>
              {executionType && <StyledText>{executionType}</StyledText>}
            </View>
            <ContentCard title='Rooms:' contents={formatArray(rooms, 'name')} />
            <ContentCard title='Groups:' contents={formatArray(groups, 'name')} />
            <ContentCard title='Lecturers:' contents={formatArray(lecturers, 'name')} />
            <ContentCard title='Note:' contents={note} />
            <ContentCard title='Show link:' contents={showLink} />
            <ContentCard title='Custom note:' contents={customNote} />
          </ScrollView>
          <View style={styles.buttonContainer}>
            {lecture.course_id && executionType_id && <InputDialogue 
              buttonContainerStyle={styles.button}
              input={customNote}
              title="Edit note"
              onRequestConfirm={updateCustomNote}
            /> }
            {lecture.course_id && executionType_id && <View style={{width: 2, backgroundColor: COLORS.background.seperator}}/>}
            
            <StyledButton containerStyle={styles.button} title='Close' onPress={onRequestClose}/>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  )
}

export default LectureDetails

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background.primaryOpaque
  },
  centeredContainer: {
    width: '85%',
    minWidth: 200,
    maxWidth: 650,
    minHeight: 200,
    maxHeight: '90%',
    backgroundColor: COLORS.background.primary,
    borderWidth: 1,
    borderColor: COLORS.background.seperator,
    //elevation: 4,
  },
  titleContainer: {
    backgroundColor: COLORS.background.secondary
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 10,
    fontSize: 18
  },
  line: {
    marginVertical: 0
  },
  contentsContainer: {
    paddingHorizontal: 5,
    marginVertical: 5,
    flexGrow: 1
  },
  subtitle: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  buttonContainer: {
    flexDirection: 'row'
  },
  button: {
    flex: 1
  }
})