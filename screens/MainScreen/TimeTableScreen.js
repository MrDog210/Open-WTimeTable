import { useEffect, useState } from "react";
import { Modal, ScrollView } from "react-native";
import Timetable from "react-native-calendar-timetable";
import { getLecturesForDate } from "../../util/database";
import HourSlice from "../../components/TimeTable/HourSlice";
import { getISODateNoTimestamp, subtrackSeconds } from "../../util/dateUtils";
import LectureDetails from "../../components/TimeTable/LectureDetails";
import Spinner from "react-native-loading-spinner-overlay";
import { SPINNER_STYLE } from "../../constants/globalStyles";

function TimeTableScreen() {
  const [isFetchingData, setIsFetchingData] = useState(false)
  const [modalVisible, setModelVisible] = useState(false)
  const [modalLecture, setModalLecture] = useState(null)
  const [lectures, setLectures] = useState([])
  const [date] = useState(new Date('2023-12-13'))

  useEffect(() => {
    async function fetchTimetable() {
      setIsFetchingData(true)
      const data = await getLecturesForDate(getISODateNoTimestamp(date))
      console.log(data)
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
      <Spinner visible={isFetchingData} {...SPINNER_STYLE}/>
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