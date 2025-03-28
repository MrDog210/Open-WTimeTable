import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Alert, RefreshControl, ScrollView, StyleSheet } from "react-native";
import Timetable from "react-native-calendar-timetable";
import { getLecturesForDate } from "../../util/database";
import HourSlice from "../../components/TimeTable/HourSlice";
import { dateFromNow, formatDate, formatWeekDate, getDates, getISODateNoTimestamp, getWeekDates, subtrackSeconds } from "../../util/dateUtils";
import LectureDetails from "../../components/TimeTable/LectureDetails";
import CalendarStrip from 'react-native-calendar-strip';
import { COLORS, isDarkTheme } from "../../constants/colors";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { calculateNowLineOffset, getColumnWidth, hasTimetableUpdated, updateLectures } from "../../util/timetableUtils";
import IconButton from "../../components/ui/IconButton";
import TimeTableHeader from "../../components/TimeTable/TimeTableHeader";
import { PREF_KEYS, UserPreferencesContext } from "../../store/userPreferencesContext";
import { hasInternetConnection } from "../../util/http";
import { getCustomLecturesForDates } from "../../store/customLectures"

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
  const animationsEnabled = userPreferencesCtx.getKey(PREF_KEYS.timetableAnimations)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return <IconButton name='calendar-clear-outline' style={{backgroundColor: COLORS.background.secondary}} onPress={openDatePicker} />
      }
    },)
  }, [])

  useEffect(() => {
    const scrollPadding = isWeekView ? 45 : -5
    scrollRef.current?.scrollTo({ // we scroll to 'now line'
      //x: getColumnWidth(isWeekView),
      y: calculateNowLineOffset(scrollPadding),
      animated: true
    })
    checkForTimetableUpdate()
  }, [])

  async function checkForTimetableUpdate() {
    const hasInternet = await hasInternetConnection()
    if(!hasInternet) return
    
    setRefreshing(true)
    try {
      const hasUpdated = await hasTimetableUpdated() // we check if the timetable has been updated
        if(hasUpdated)
          onRefresh()
      else
        setRefreshing(false)
    } catch (error) {
      setRefreshing(false)
    }
  }
  useEffect(() =>{
    navigation.setOptions({
      title: isWeekView ? formatWeekDate(week.from, week.till) : formatDate(date)
    })
  }, [date, week])

  useEffect(() => { // querring timetable data
    async function getLectures() {
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
          lec.push({lecture: lecture, startDate: subtrackSeconds(lecture.start_time, -60), endDate: subtrackSeconds(lecture.end_time, 60)})
        })
      })

      const customLectures = await getCustomLecturesForDates(dates)
      console.log("CUSTOM LECTURES: ", customLectures)

      setLectures([...lec, ...customLectures])
      setIsFetchingData(false)
      setWeek(getWeekDates(date)) // stupid
    }
    getLectures()
  }, [date])

  useEffect(() => {
    console.log(JSON.stringify(lectures))
  }, [lectures])

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
    console.log('Updating databse')
    try {
      await updateLectures(new Date(), dateFromNow(200), true)
      setDate(new Date(date)) // we refresh the page
    } catch (error) {
      Alert.alert('Error', error.message)
    }
    setRefreshing(false)
  }

  const fontColor = isDarkTheme ? COLORS.foreground.primary : COLORS.background.primary

  return (
    <>
      <LectureDetails modalVisible={modalVisible} lecture={modalLecture} onRequestClose={() => {setModelVisible(false)}} />
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} ref={scrollRef}>
          <Timetable items={lectures} 
            renderItem={props => <HourSlice {...props} onPress={lecturePressed} smallMode={isWeekView} animationsDisabled={!animationsEnabled}/>} 
            date={isWeekView ? undefined : date}
            range={isWeekView ? week : undefined}

            fromHour={6}
            toHour={22}
            hourHeight={isWeekView ? 65 : 80}
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
        calendarColor={isDarkTheme ? COLORS.background.secondary : COLORS.foreground.primary}
        calendarHeaderStyle={{color: fontColor, fontSize: 14}}
        dateNumberStyle={{color: fontColor, fontSize: 14}}
        dateNameStyle={{color: fontColor, fontSize: 8}}
        markedDatesStyle={{color: COLORS.background.primary}}
        
        highlightDateNumberStyle={{color: fontColor, fontSize: 14}}
        highlightDateNameStyle={{color: fontColor, fontSize: 8}}
        highlightDateContainerStyle={{}}

        iconStyle={{tintColor: fontColor, height: 20}}
        iconContainer={{marginHorizontal: 5, height: 30, width: 30}}
        daySelectionAnimation={{type: 'background', duration: '200', highlightColor: isDarkTheme ? COLORS.background.primary : COLORS.foreground.secondary}}
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
      backgroundColor: COLORS.foreground.primaryOpaque
    },
    line: {
      backgroundColor: COLORS.foreground.primaryOpaque
    },
  }
})