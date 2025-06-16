import { CommonActions, useNavigation, useRoute, type StaticScreenProps } from "@react-navigation/native";
import Text from "../../components/ui/Text";
import Container from "../../components/ui/Container";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { DefaultView, useSettings } from "../../context/UserSettingsContext";
import { Lecture, TimetableLecture } from "../../types/types";
import { addDaysToDate, dateFromNow, formatDate, formatWeekDate, getDates, getFriday, getISODateNoTimestamp, getMonday, getWeekDates, subtrackSeconds } from "../../util/dateUtils";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { calculateNowLineOffset, getColumnWidth, hasTimetableUpdated, updateLectures } from "../../util/timetableUtils";
import { hasInternetConnection } from "../../util/http/http";
import { getDatesWithLectures, getLecturesForDate } from "../../util/store/database";
import { getCustomLecturesForDates } from "../../util/store/customLectures";
import { Agenda, Calendar, CalendarProvider, ExpandableCalendar, TimelineList, WeekCalendar } from "react-native-calendars";
import Timetable from "react-native-calendar-timetable";
import HourSlice from "../../components/timetable/HourSlice";
import TimeTableHeader from "../../components/timetable/TimetableHeader";
import DatePicker from "react-native-date-picker";
import IconButton from "../../components/ui/IconButton";
import LectureDetails from "../../components/timetable/LectureDetails";
import { MarkedDates } from "react-native-calendars/src/types";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";

type TimeTableScreenProps = StaticScreenProps<{
  isWeekView: boolean
}>;

type LectureQuery = {
  lectures: TimetableLecture[],
  markedDates: MarkedDates
}

let ranOnce = false

function TimeTableScreen({ route }: TimeTableScreenProps) {
  const { timetableAnimationsEnabled, defaultView } = useSettings()
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [modalVisible, setModelVisible] = useState<boolean>(false)
  const [modalLecture, setModalLecture] = useState<Lecture | null>(null)
  const [date, setDate] = useState<Date>(new Date("2025-05-05"))
  const [week, setWeek] = useState(getWeekDates(date)) // TODO: maybe remove this
  const scrollRef = useRef<ScrollView>(null);
  const navigation = useNavigation()
  const { isWeekView } = route.params
  const [showDatePicker, setShowDatePicker] = useState(false)
  const route2 = useRoute()

  const markedDatesSpan = {
    from: getISODateNoTimestamp(addDaysToDate(getMonday(date), -7)),
    till: getISODateNoTimestamp(addDaysToDate(getFriday(date), 7)) 
  }

  const checkForUpdatesMutation = useMutation({
    mutationFn: async () => {
      
    }
  })

  const { data: lectures } = useQuery<TimetableLecture[]>({
    initialData: [],
    queryKey: ['lectures', date, isWeekView],
    queryFn: async () => {
      console.log('querying lectures')
      let dates: Date[] = []
      if(isWeekView) {
        const WEEK = getWeekDates(date)
        dates = getDates(WEEK.from, WEEK.till)
        console.log(dates)
      } else {
        dates.push(date)
      }
      const lec: TimetableLecture[] = []

      const dataPromise = dates.map((d) => getLecturesForDate(getISODateNoTimestamp(d)))
      const data = await Promise.all(dataPromise)
      data.forEach(lectures => {
        lectures.forEach(lecture => {
          lec.push({lecture: lecture, startDate: subtrackSeconds(lecture.start_time, -60), endDate: subtrackSeconds(lecture.end_time, 60)})
        })
      });

      const customLectures: TimetableLecture[] = []//= await getCustomLecturesForDates(dates)
      
      if(isWeekView)
        setWeek(getWeekDates(date)) // stupid

      return [...lec, ...customLectures]
    },
    networkMode: 'always'
  })

  const { data: markedDates } = useQuery<MarkedDates>({
    initialData: {},
    queryKey: ['markedDates', markedDatesSpan],
    queryFn: async () => {
      const datesWithLectures = await getDatesWithLectures(
        markedDatesSpan.from, 
        markedDatesSpan.till
      )
      const markedD: MarkedDates = {}
      datesWithLectures.forEach(item => {
        markedD[item.date] = {
          //selected: true,
          marked: true,
          //dotColor: 'blue',
          //selectedColor: "purple",
        }
      })
      return markedD
    },
    placeholderData: keepPreviousData,
    networkMode: 'always'
  })

  useLayoutEffect(() => {
    if(!ranOnce) {
      ranOnce = true,
      console.log("SETTING NAVIGATION OPTIONS")
      checkForUpdatesMutation.mutateAsync()
      navigation.setOptions({
        headerRight: () => {
          return <IconButton name='calendar-clear-outline' onPress={openDatePicker} />
        }
      })
      if(route2.name === 'DayView' && defaultView === DefaultView.WEEK_VIEW) {
        navigation.navigate('Home', {screen: 'WeekView', params: {isWeekView: true}})
      }
    }  
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

  useEffect(() => {
    //console.log(JSON.stringify(lectures))
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
    <Container>
      <LectureDetails modalVisible={modalVisible} lecture={modalLecture!} onRequestClose={() => {setModelVisible(false)}} />
      <DatePicker modal open={showDatePicker} date={date} onConfirm={onConfirmDate} onCancel={onCancelDate} mode="date" />
      <CalendarProvider 
        date={getISODateNoTimestamp(date)}
        onDateChanged={(newDate) => {
          setDate(new Date(newDate))
        }}
      >
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing || checkForUpdatesMutation.isPending} onRefresh={onRefresh} />} ref={scrollRef}>
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
          allowShadow={false}
                    //leftArrowImageSource={require('../img/previous.png')}
          //rightArrowImageSource={require('../img/next.png')}
          markedDates={markedDates}

        />
      </CalendarProvider>
    </Container>
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