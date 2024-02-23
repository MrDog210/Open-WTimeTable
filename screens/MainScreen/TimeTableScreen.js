import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet } from "react-native";
import Timetable from "react-native-calendar-timetable";
import { getLecturesForDate } from "../../util/database";
import HourSlice from "../../components/TimeTable/HourSlice";
import { dateFromNow, formatDate, formatWeekDate, getDates, getISODateNoTimestamp, getWeekDates, subtrackSeconds } from "../../util/dateUtils";
import LectureDetails from "../../components/TimeTable/LectureDetails";
import CalendarStrip from 'react-native-calendar-strip';
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../constants/colors";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { calculateNowLineOffset, getColumnWidth, updateLectures } from "../../util/timetableUtils";
import IconButton from "../../components/ui/IconButton";
import TimeTableHeader from "../../components/TimeTable/TimeTableHeader";
import { UserPreferencesContext } from "../../store/userPreferencesContext";

function TimeTableScreen({ navigation, route }) {
  const userPreferencesCtx = useContext(UserPreferencesContext)
  const [isFetchingData, setIsFetchingData] = useState(false)
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModelVisible] = useState(false)
  const [modalLecture, setModalLecture] = useState(null)
  const [lectures, setLectures] = useState([])
  const [date, setDate] = useState(new Date())
  const [week, setWeek] = useState(getWeekDates(date))
  const scrollRef = useRef();

  const { isWeekView } = route.params

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return <IconButton name='calendar-clear-outline' style={{backgroundColor: COLORS.background.secondary}} onPress={openDatePicker} />
      }
    },)
    const scrollPadding = isWeekView ? 45 : -5
    scrollRef.current?.scrollTo({ // we scroll to 'now line'
      y: calculateNowLineOffset(scrollPadding),
      animated: true
    })
  }, [])

  useEffect(() =>{
    navigation.setOptions({
      title: isWeekView ? formatWeekDate(week.from, week.till) : formatDate(date)
    })
  }, [date, week])

  useEffect(() => {
    setIsFetchingData(true)

    let dates = []
    if(isWeekView) {
      const WEEK = getWeekDates(date)
      dates = getDates(WEEK.from, WEEK.till)
      console.log(dates)
    } else {
      dates.push(date)
    }
    const lec = []
    dates.forEach((d) => {
      const data = getLecturesForDate(getISODateNoTimestamp(d))
      data.forEach(lecture => {
        lec.push({lecture: lecture, startDate: lecture.start_time, endDate: subtrackSeconds(lecture.end_time, 1)})
      })
    })
    setLectures([...lec])
    setIsFetchingData(false)
    setWeek(getWeekDates(date)) // stupid
  }, [date])

  function lecturePressed(lecture) {
    setModalLecture(lecture)
    setModelVisible(true)
  }

  function openDatePicker() {
    DateTimePickerAndroid.open({
      value: date,
      onChange: (date) => {setDate(new Date(date.nativeEvent.timestamp))},
      mode: 'date',
    });
  }

  async function onRefresh() {
    setRefreshing(true)
    const updateSpan = userPreferencesCtx.getKey('timetableUpdateSpan')
    await updateLectures(new Date(), dateFromNow(updateSpan))
    setRefreshing(false)
    setDate(new Date(date)) // we refresh the page
  }

  return (
    <>
      <LectureDetails modalVisible={modalVisible} lecture={modalLecture} onRequestClose={() => {setModelVisible(false)}} />
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} ref={scrollRef}>
          <Timetable items={lectures} renderItem={props => <HourSlice {...props} onPress={lecturePressed}/>} 
            date={isWeekView ? undefined : date}
            range={isWeekView ? week : undefined}

            fromHour={6}
            toHour={22}
            hourHeight={80}
            style={timetableStyles}

            renderHeader={isWeekView ? props => <TimeTableHeader {...props} /> : undefined}

            columnWidth={isWeekView ? getColumnWidth(isWeekView) : undefined}
          />
        </ScrollView>
        <CalendarStrip
        selectedDate={date}
        onDateSelected={setDate}

        scrollable
        scrollerPaging
        style={{height:90, paddingTop: 10, paddingBottom: 10}}
        calendarColor={COLORS.foreground.accentPressed}
        calendarHeaderStyle={{color: COLORS.background.primary, fontSize: 14}}
        dateNumberStyle={{color: COLORS.background.primary, fontSize: 14}}
        dateNameStyle={{color: COLORS.background.primary, fontSize: 8}}
        markedDatesStyle={{color: COLORS.foreground.accentPressed}}
        
        highlightDateNumberStyle={{color: COLORS.background.primary, fontSize: 14}}
        highlightDateNameStyle={{color: COLORS.background.primary, fontSize: 8}}
        highlightDateContainerStyle={{}}

        iconStyle={{tintColor: COLORS.background.primary, height: 20}}
        iconContainer={{marginHorizontal: 5, backgroundColor: COLORS.foreground.accent, borderRadius: 30, height: 30, width: 30}}
        daySelectionAnimation={{type: 'background', duration: '200', highlightColor: COLORS.foreground.accentDisabled}}
      />
    </>
  )
}

export default TimeTableScreen

const timetableStyles = StyleSheet.create({
  container: {
    marginBottom: 50
  },
  timeContainer: {
    backgroundColor: COLORS.background.primary
  },
  time: {
    color: COLORS.foreground.secondary,
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