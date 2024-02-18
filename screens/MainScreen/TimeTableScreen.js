import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import Timetable from "react-native-calendar-timetable";
import { getLecturesForDate } from "../../util/database";
import HourSlice from "../../components/TimeTable/HourSlice";
import { getISODateNoTimestamp, subtrackSeconds } from "../../util/dateUtils";
import LectureDetails from "../../components/TimeTable/LectureDetails";
import CalendarStrip from 'react-native-calendar-strip';
import { SafeAreaView } from "react-native-safe-area-context";

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
        <CalendarStrip
        selectedDate={date}
        onDateSelected={setDate}

        scrollable
        style={{height:100, paddingTop: 20, paddingBottom: 10}}
        calendarColor={'#3343CE'}
        calendarHeaderStyle={{color: 'white'}}
        dateNumberStyle={{color: 'white'}}
        dateNameStyle={{color: 'white'}}
        iconContainer={{flex: 0.1}}
      />
        <ScrollView>
          <Timetable items={lectures} renderItem={props => <HourSlice {...props} onPress={lecturePressed}/>} 
            date={date}

            fromHour={6}
            toHour={22}
            hourHeight={80}
          />
        </ScrollView>
      </SafeAreaView>
    </>
  )
}

export default TimeTableScreen