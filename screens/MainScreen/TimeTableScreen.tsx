import { useNavigation, type StaticScreenProps } from "@react-navigation/native";
import Text from "../../components/ui/Text";
import Container from "../../components/ui/Container";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSettings } from "../../context/UserSettingsContext";
import { Lecture, TimetableLecture } from "../../types/types";
import { dateFromNow, formatDate, formatWeekDate, getDates, getISODateNoTimestamp, getWeekDates, subtrackSeconds } from "../../util/dateUtils";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { calculateNowLineOffset, getColumnWidth, hasTimetableUpdated, updateLectures } from "../../util/timetableUtils";
import { hasInternetConnection } from "../../util/http/http";
import { getLecturesForDate } from "../../util/store/database";
import { getCustomLecturesForDates } from "../../util/store/customLectures";
import { Agenda, Calendar, CalendarProvider, ExpandableCalendar, TimelineList, WeekCalendar } from "react-native-calendars";
import Timetable from "react-native-calendar-timetable";
import HourSlice from "../../components/timetable/HourSlice";
import TimeTableHeader from "../../components/timetable/TimetableHeader";
import DatePicker from "react-native-date-picker";
import IconButton from "../../components/ui/IconButton";
import LectureDetails from "../../components/timetable/LectureDetails";

type TimeTableScreenProps = StaticScreenProps<{
  isWeekView: boolean
}>;

function TimeTableScreen({ route }: TimeTableScreenProps) {
  const { timetableAnimationsEnabled } = useSettings()
  const [isFetchingData, setIsFetchingData] = useState<boolean>(false)
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [modalVisible, setModelVisible] = useState<boolean>(false)
  const [modalLecture, setModalLecture] = useState<Lecture | null>(null)
  const [lectures, setLectures] = useState<TimetableLecture[]>([])
  const [date, setDate] = useState<Date>(new Date("2025-05-05"))
  const [week, setWeek] = useState(getWeekDates(date))
  const scrollRef = useRef<ScrollView>(null);
  const navigation = useNavigation()
  const isWeekView = false//const { isWeekView } = route.params
  const [showDatePicker, setShowDatePicker] = useState(false)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return <IconButton name='calendar-clear-outline' onPress={openDatePicker} />
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
      console.log('querying lectures')
      let dates = []
      if(isWeekView) {
        const WEEK = getWeekDates(date)
        dates = getDates(WEEK.from, WEEK.till)
        console.log(dates)
      } else {
        dates.push(date)
      }
      const lec: TimetableLecture[] = []
      console.log("searched dates: ", dates)
      for(const d of dates) {
        const data = await getLecturesForDate(getISODateNoTimestamp(d))
        console.log("lecture: ", data)
        data.forEach(lecture => {
          lec.push({lecture: lecture, startDate: subtrackSeconds(lecture.start_time, -60), endDate: subtrackSeconds(lecture.end_time, 60)})
        })
      }

      const customLectures: TimetableLecture[] = []//= await getCustomLecturesForDates(dates)
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

  function lecturePressed(lecture: Lecture) {
    setModalLecture(lecture)
    setModelVisible(true)
  }

  function openDatePicker() {
    setShowDatePicker(true)
  }

  async function onRefresh() {
    setRefreshing(true)
    console.log('Updating databse')
    try {
      await updateLectures(new Date(), dateFromNow(200), true)
      setDate(new Date(date)) // we refresh the page
    } catch (error) {
      //Alert.alert('Error', error.message)
    }
    setRefreshing(false)
  }

  function onConfirmDate(date: Date) {
    setDate(date)
    setShowDatePicker(false)
  }

  function onCancelDate() {
    setShowDatePicker(false)
  }

  return (
    <>
      <LectureDetails modalVisible={modalVisible} lecture={modalLecture!} onRequestClose={() => {setModelVisible(false)}} />
    <Container>
      <DatePicker modal open={showDatePicker} date={date} onConfirm={onConfirmDate} onCancel={onCancelDate} mode="date" />
      <CalendarProvider 
        date={getISODateNoTimestamp(date)}
        onDateChanged={(newDate) => {
          console.log(newDate)
        }}
      >
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} ref={scrollRef}>
        <Timetable 
          items={lectures} 
          renderItem={({key, ...props}) => <HourSlice key={key} {...props} onPress={lecturePressed} smallMode={isWeekView} animationsDisabled={!timetableAnimationsEnabled}/>} 
          date={(isWeekView ? undefined : date) as any}
          range={isWeekView ? week : undefined}

          fromHour={6}
          toHour={22}
          hourHeight={isWeekView ? 65 : 80}
          

          renderHeader={isWeekView ? props => <TimeTableHeader {...props} /> : undefined}

          columnWidth={isWeekView ? getColumnWidth(isWeekView) : undefined}
        />
      </ScrollView>
        <WeekCalendar
          firstDay={1}
                    //leftArrowImageSource={require('../img/previous.png')}
          //rightArrowImageSource={require('../img/next.png')}
          //markedDates={this.marked}

        />
      </CalendarProvider>
    </Container>
    </>
  )

  /*const fontColor = isDarkTheme ? COLORS.foreground.primary : COLORS.background.primary

  return (
    <Container>
      <LectureDetails modalVisible={modalVisible} lecture={modalLecture} onRequestClose={() => {setModelVisible(false)}} />
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} ref={scrollRef}>
        <Timetable items={lectures} 
          renderItem={({key, ...props}) => <HourSlice key={key} {...props} onPress={lecturePressed} smallMode={isWeekView} animationsDisabled={!timetableAnimationsEnabled}/>} 
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
    </Container>
  )*/
}

export default TimeTableScreen

/*const timetableStyles = StyleSheet.create({
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
})*/