import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import Timetable from "react-native-calendar-timetable";
import { getLecturesForDate } from "../../util/database";
import HourSlice from "../../components/TimeTable/HourSlice";
import { getISODateNoTimestamp, subtrackSeconds } from "../../util/dateUtils";

function TimeTableScreen() {
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

  return (
    <ScrollView>
      <Timetable items={lectures} renderItem={props => <HourSlice {...props}/>} 
        date={date}

        fromHour={6}
        toHour={22}
        hourHeight={80}
      />
    </ScrollView>
  )
}

export default TimeTableScreen