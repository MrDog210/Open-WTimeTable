import { useState } from "react"
import { Lecture } from "../../types/types"
import { setNoteForCourse } from "../../util/store/database"
import { ScrollView, View, StyleSheet } from "react-native"
import Text from "../ui/Text"
import { getTimeFromDate } from "../../util/dateUtils"
import { formatArray } from "../../util/timetableUtils"
import { useTheme } from "../../context/ThemeContext"
import EditUsersNote from "./EditUsersNote"
import { Clock, DoorClosed, GraduationCap, Info, Link, LucideIcon, NotebookPen, Pencil, UserGroup } from "lucide-react-native"
import IconButton from "../ui/IconButton"
import Badge from "../ui/Badge"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useQueryClient } from "@tanstack/react-query"
import { QUERY_LECTURES } from "../../util/http/reactQuery"

type ContentCardProps = {
  Icon: LucideIcon,
  title: string,
  contents?: string | null
}

function ContentCard({Icon, title, contents}: ContentCardProps) {
  const { colors } = useTheme()
  if(contents === null || contents === undefined || contents === '')
    return <></>

  return (
    <View style={{
      flex: 1, 
      flexDirection: 'row', 
      marginVertical: 10, 
      gap: 10, 
      alignItems: 'center',
    }}>
      <View style={{
        backgroundColor: colors.surfaceVariant,
        padding: 10,
        borderRadius: 8
      }}>
        <Icon color={colors.onSurface} size={20} />
      </View>
      <View style={{
        marginLeft: 3
      }}>
        <Text style={{
          color: colors.onSurface
        }}>{title}</Text>
        <Text style={{flex: 1, fontWeight: '500'}}>{contents}</Text>
      </View>
    </View>
  )
}

type LectureDetailsProps = {
  lecture: Lecture,
}

function LectureDetails({lecture}: LectureDetailsProps) {
  const {course, course_id, eventType, start_time, end_time, note, showLink, rooms, groups, lecturers, executionType, executionType_id, usersNote} = lecture
  const [customNote, setCustomNote] = useState<string>(usersNote ? usersNote.note : '')
  const [isEditing, setIsEditing] = useState(false)
  const {colors} = useTheme()
  const insets = useSafeAreaInsets()
  const queryClient = useQueryClient()

  /*useEffect(() => {
    setCustomNote(usersNote?.note ?? '')
    setIsEditing(false)
  }, [lecture.id, usersNote?.note])*/

  async function updateCustomNote(newCustomNote: string) {
    await setNoteForCourse(newCustomNote, course_id, executionType_id)
    setCustomNote(newCustomNote)
    setIsEditing(false)
    queryClient.invalidateQueries({ queryKey: [QUERY_LECTURES] })
  }

  return (
    <View style={styles.container}>
      { !isEditing ? (
        <ScrollView>
          <View style={{
            flex: 1,
            flexDirection: 'row',
            gap: 10,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Text style={styles.title}>{course ? course : eventType}</Text>
            {executionType && <Badge>{executionType}</Badge>}
          </View>
          <View style={styles.contentsContainer}>
            <ContentCard title="Time" Icon={Clock} contents={`${getTimeFromDate(start_time)} - ${getTimeFromDate(end_time)}`} />
            <ContentCard title="Rooms" Icon={DoorClosed} contents={formatArray(rooms, 'name')} />
            <ContentCard title="Groups" Icon={UserGroup} contents={formatArray(groups, 'name')} />
            <ContentCard title="Lecturers" Icon={GraduationCap} contents={formatArray(lecturers, 'name')} />
            <ContentCard title="" Icon={Info} contents={note} />
            <ContentCard title="Link" Icon={Link} contents={showLink} />
            <View style={{flexDirection: 'row', flex: 1, justifyContent: 'center'}}>
              <ContentCard title="My note" Icon={NotebookPen} contents={customNote !== '' ? customNote : 'No note added'} />
              <IconButton icon={Pencil} iconColor={colors.onSurface} iconSize={20} onPress={() => setIsEditing(true)} mode="TRANSPARENT"  />
            </View>
          </View>
          <View style={{height: insets.bottom}} />
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
    paddingTop: 20,
  },
  title: {
    fontWeight: '800',
    textAlign: 'center',
    paddingVertical: 10,
    fontSize: 22,
    flexShrink: 1,
  },
  line: {
    marginVertical: 0
  },
  contentsContainer: {
    paddingHorizontal: 5,
    marginVertical: 5,
    flexGrow: 1
  },
  button: {
    flex: 1
  }
})