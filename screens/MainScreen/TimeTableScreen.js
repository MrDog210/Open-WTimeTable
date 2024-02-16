import { useEffect, useState } from "react";
import { Modal, ScrollView } from "react-native";
import Timetable from "react-native-calendar-timetable";
import { getLecturesForDate } from "../../util/database";
import HourSlice from "../../components/TimeTable/HourSlice";
import { getISODateNoTimestamp, subtrackSeconds } from "../../util/dateUtils";
import LectureDetails from "../../components/TimeTable/LectureDetails";

function TimeTableScreen() {
  const [modalVisible, setModelVisible] = useState(false)
  const [modalLecture, setModalLecture] = useState(null)
  const [lectures, setLectures] = useState([])
  const [date] = useState(new Date('2023-12-13'))

  useEffect(() => {
    async function fetchTimetable() {
      const data = await getLecturesForDate(getISODateNoTimestamp(date))
      console.log(data)
      setLectures([])
      data.forEach(lecture => {
        setLectures(values => [...values, {lecture: lecture, startDate: lecture.start_time, endDate: subtrackSeconds(lecture.end_time, 1)}])
      })
    }
    fetchTimetable()
  }, [])

  function lecturePressed(lecture) {
    console.log(lecture)
    setModalLecture(lecture)
    setModelVisible(true)
  }

  return (
    <>
      <LectureDetails modalVisible={modalVisible} lecture={modalLecture} onRequestClose={() => {setModelVisible(false)}} />
      <ScrollView>
        <Timetable items={lectures} renderItem={props => <HourSlice {...props} onPress={lecturePressed}/>} 
          date={date}

          fromHour={6}
          toHour={22}
          hourHeight={80}
        />
      </ScrollView>
    </>
  )
}

export default TimeTableScreen