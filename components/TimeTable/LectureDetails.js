import { Modal, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../constants/colors";
import StyledButton from "../ui/StyledButton";
import { getTimeFromDate } from "../../util/dateUtils";
import { formatArray } from "../../util/timetableUtils";
import ContentCard from "../ui/ContentCard";

function LectureDetails({modalVisible, onRequestClose, lecture}) {
  if(lecture === null)
    return
  const {course, eventType, start_time, end_time, note, showLink, color, colorText, rooms, groups, lecturers, executionType} = lecture
  return (
    <Modal visible={modalVisible} transparent={true} animationType="fade">
      <View style={styles.container}>
        <View style={styles.centeredContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{course ? course : eventType}</Text>
          </View>
          <View style={styles.contentsContainer}>
            <View style={styles.subtitle}>
              <Text>{`${getTimeFromDate(start_time)} - ${getTimeFromDate(end_time)}`}</Text>
              {executionType && <Text>{executionType}</Text>}
            </View>
            <ContentCard title='Rooms:' contents={formatArray(rooms, 'name')} />
            <ContentCard title='Groups:' contents={formatArray(groups, 'name')} />
            <ContentCard title='Lecturers:' contents={formatArray(lecturers, 'name')} />
            <ContentCard title='Note:' contents={note} />
            <ContentCard title='Show link:' contents={showLink} />
            <ContentCard title='Note:' contents={note} />
          </View>
          <StyledButton title='Close' onPress={onRequestClose}/>
        </View>
      </View>
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
    minHeight: 200,
    backgroundColor: COLORS.background.primary,
    borderWidth: 1,
    borderColor: COLORS.background.seperator,
    elevation: 4,
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
  contentsContainer: {
    padding: 5,
    marginVertical: 5,
    flexGrow: 1,
  },
  subtitle: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  }
})