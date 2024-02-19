import { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import Timetable from "react-native-calendar-timetable";
import { getLecturesForDate } from "../../util/database";
import HourSlice from "../../components/TimeTable/HourSlice";
import { getISODateNoTimestamp, subtrackSeconds } from "../../util/dateUtils";
import LectureDetails from "../../components/TimeTable/LectureDetails";
import CalendarStrip from 'react-native-calendar-strip';
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../constants/colors";

function TimeTableScreen() {
  const [isFetchingData, setIsFetchingData] = useState(false)
  const [modalVisible, setModelVisible] = useState(false)
  const [modalLecture, setModalLecture] = useState(null)
  const [lectures, setLectures] = useState([])
  const [date, setDate] = useState(new Date('2023-12-13'))

  useEffect(() => {
    async function fetchTimetable() {
      setIsFetchingData(true)
      const data = await getLecturesForDate(getISODateNoTimestamp(date))
      //console.log(data)
      setLectures([])
      data.forEach(lecture => {
        setLectures(values => [...values, {lecture: lecture, startDate: lecture.start_time, endDate: subtrackSeconds(lecture.end_time, 1)}])
      })
      setIsFetchingData(false)
    }
    fetchTimetable()
  }, [date])

  function lecturePressed(lecture) {
    setModalLecture(lecture)
    setModelVisible(true)
  }

  return (
    <>
      <LectureDetails modalVisible={modalVisible} lecture={modalLecture} onRequestClose={() => {setModelVisible(false)}} />
      <SafeAreaView style={{ flex: 1}}>
        
        <ScrollView>
          <Timetable items={lectures} renderItem={props => <HourSlice {...props} onPress={lecturePressed}/>} 
            date={date}

            fromHour={6}
            toHour={22}
            hourHeight={80}
            style={timetableStyles}
          />
        </ScrollView>
        <CalendarStrip
        selectedDate={date}
        onDateSelected={setDate}

        scrollable
        scrollerPaging
        style={{height:100, paddingTop: 20, paddingBottom: 10}}
        calendarColor={COLORS.foreground.accentPressed}
        calendarHeaderStyle={{color: COLORS.background.primary}}
        dateNumberStyle={{color: COLORS.background.primary}}
        dateNameStyle={{color: COLORS.background.primary}}
        markedDatesStyle={{color: COLORS.foreground.accentPressed}}
        
        highlightDateNumberStyle={{color: COLORS.background.primary}}
        highlightDateNameStyle={{color: COLORS.background.primary}}

        iconStyle={{tintColor: COLORS.background.primary}}
        iconContainer={{marginHorizontal: 5, backgroundColor: COLORS.foreground.accent, borderRadius: 30, height: 30, width: 30}}
        daySelectionAnimation={{type: 'background', duration: '200', highlightColor: COLORS.foreground.accentDisabled}}
      />
      </SafeAreaView>
    </>
  )
}

export default TimeTableScreen

const timetableStyles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background.primary,
    marginVertical: 10
  },
  headerContainer: {

  },
  headerText: {

  },
  headersContainer: {

  },
  contentContainer: { 

  },
  timeContainer: {

  },
  time: {
    color: COLORS.foreground.secondary
  },
  lines: {
    borderColor: COLORS.foreground.secondary
  },
  nowLine: {
    dot: {
      backgroundColor: COLORS.foreground.primary
    },
    line: {
      backgroundColor: COLORS.foreground.primary
    },
  }
})