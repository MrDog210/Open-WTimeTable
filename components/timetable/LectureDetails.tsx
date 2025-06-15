import { useEffect, useState } from "react"
import { CustomLecture, Lecture } from "../../types/types"
import Animated, { Easing, useSharedValue, withTiming } from "react-native-reanimated"
import { setNoteForCourse } from "../../util/store/database"
import { Modal, ScrollView, View, StyleSheet } from "react-native"
import Text from "../ui/Text"
import Divider from "../ui/Divider"
import { getTimeFromDate } from "../../util/dateUtils"
import { formatArray } from "../../util/timetableUtils"
import Button from "../ui/Button"
import { useTheme } from "../../context/ThemeContext"

type ContentCardProps = {
  title: string,
  contents?: string | null
}

function ContentCard({title, contents}: ContentCardProps) {
  if(contents === null || contents === undefined || contents === '')
    return <></>

  return (
    <View>
      <Text style={{fontWeight: 'bold'}}>{title}</Text>
      <Text>{contents}</Text>
    </View>
  )
}

type LectureDetailsProps = {
  modalVisible: boolean,
  onRequestClose: () => void,
  lecture: Lecture
}

function LectureDetails({modalVisible, onRequestClose, lecture}: LectureDetailsProps) {
  const { colors } = useTheme()
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

  function updateCustomNote(newCustomNote: any) {
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
            <Text style={styles.title}>{course ? course : eventType}</Text>
          </View>
          <Divider style={styles.line}/>
          <ScrollView style={styles.contentsContainer}>
            <View style={styles.subtitle}>
              <Text>{`${getTimeFromDate(start_time)} - ${getTimeFromDate(end_time)}`}</Text>
              {executionType && <Text>{executionType}</Text>}
            </View>
            <ContentCard title='Rooms:' contents={formatArray(rooms, 'name')} />
            <ContentCard title='Groups:' contents={formatArray(groups, 'name')} />
            <ContentCard title='Lecturers:' contents={formatArray(lecturers, 'name')} />
            <ContentCard title='Note:' contents={note} />
            <ContentCard title='Show link:' contents={showLink} />
            <ContentCard title='Custom note:' contents={customNote} />
          </ScrollView>
          <View style={styles.buttonContainer}>
            {/*lecture.course_id && executionType_id && <InputDialogue 
              buttonContainerStyle={styles.button}
              input={customNote}
              title="Edit note"
              onRequestConfirm={updateCustomNote}
            /> */}
            {lecture.course_id && executionType_id && <View style={{width: 2, backgroundColor: colors.surface }}/>}
            
            <Button containerStyle={styles.button} onPress={onRequestClose}>Close</Button>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  )
}

export default LectureDetails

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    //backgroundColor: COLORS.background.primaryOpaque,
    paddingHorizontal: 10
  },
  centeredContainer: {
    width: 200,
    height: 100,
    //rwidth: '85%',
    //minWidth: 200,
    //maxWidth: 650,
    //minHeight: 200,
    //maxHeight: '90%',
    //backgroundColor: COLORS.background.primary,
    borderWidth: 1,
    //borderColor: COLORS.background.seperator,
    borderRadius: 10,
    overflow: 'hidden'
    //elevation: 4,
  },
  titleContainer: {
    //backgroundColor: COLORS.background.secondary
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