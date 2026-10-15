import { type JSX, useEffect, useState } from "react"
import { Lecture } from "../../types/types"
import Animated, { Easing, useSharedValue, withTiming } from "react-native-reanimated"
import { setNoteForCourse } from "../../util/store/database"
import { Modal, ScrollView, View, StyleSheet } from "react-native"
import Text from "../ui/Text"
import Divider from "../ui/Divider"
import { getTimeFromDate } from "../../util/dateUtils"
import { formatArray } from "../../util/timetableUtils"
import Button from "../ui/Button"
import { useTheme } from "../../context/ThemeContext"
import EditUsersNote from "./EditUsersNote"
import { BlurView } from "expo-blur"
import { DoorClosed, GraduationCap, GroupIcon, Info, Link, LucideIcon, NotebookPen, UserGroup } from "lucide-react-native"

type ContentCardProps = {
  Icon: LucideIcon,
  contents?: string | null
}

function ContentCard({Icon, contents}: ContentCardProps) {
  const { colors } = useTheme()
  if(contents === null || contents === undefined || contents === '')
    return <></>

  return (
    <View style={{flexDirection: 'row', marginVertical: 5, gap: 10, alignItems: 'center'}}>
      <Icon color={colors.onSurface} />
      <Text>{contents} {contents} {contents} {contents} {contents}</Text>
    </View>
  )
}

type LectureDetailsProps = {
  lecture: Lecture
}

function LectureDetails({lecture}: LectureDetailsProps) {
  const {course, course_id, eventType, start_time, end_time, note, showLink, rooms, groups, lecturers, executionType, executionType_id, usersNote} = lecture
  const [customNote, setCustomNote] = useState<string>(usersNote ? usersNote.note : '')
  const [isEditing, setIsEditing] = useState(false)

  function updateCustomNote(newCustomNote: string) {
    setNoteForCourse(newCustomNote, course_id, executionType_id)
    setCustomNote(newCustomNote)
    setIsEditing(false)
  }

  /*useEffect(() => {
    setIsEditing(false)
    setCustomNote(usersNote ? usersNote.note : '')
  }, [lecture, usersNote])*/

  return (
    <View style={styles.container}>
      { !isEditing ? (
        <ScrollView>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{course ? course : eventType}</Text>
          </View>
          <Divider style={styles.line}/>
          <View style={styles.contentsContainer}>
            <View style={styles.subtitle}>
              <Text>{`${getTimeFromDate(start_time)} - ${getTimeFromDate(end_time)}`}</Text>
              {executionType && <Text>{executionType}</Text>}
            </View>
            <ContentCard Icon={DoorClosed} contents={formatArray(rooms, 'name')} />
            <ContentCard Icon={UserGroup} contents={formatArray(groups, 'name')} />
            <ContentCard Icon={GraduationCap} contents={formatArray(lecturers, 'name')} />
            <ContentCard Icon={Info} contents={note} />
            <ContentCard Icon={Link} contents={showLink} />
            <ContentCard Icon={NotebookPen} contents={customNote} />
          </View>
        </ScrollView>
      ) : (
        <EditUsersNote note={customNote} onCancelPressed={() => setIsEditing(false)} onConfirmPressed={updateCustomNote} />
      )}
    </View>
  )
}

export default LectureDetails


const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop: 20
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
    justifyContent: 'space-evenly',
    paddingVertical: 5,
  },
  button: {
    flex: 1
  }
})