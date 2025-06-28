/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigation, useRoute, type StaticScreenProps } from "@react-navigation/native";
import Container from "../../components/ui/Container";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { DefaultView, useSettings } from "../../context/UserSettingsContext";
import { Lecture, TimetableLecture } from "../../types/types";
import { dateFromNow, formatDate, formatWeekDate, getDates, getISODateNoTimestamp, getWeekDates, subtrackSeconds } from "../../util/dateUtils";
import { RefreshControl, ScrollView, useWindowDimensions, } from "react-native";
import { calculateNowLineOffset, getColumnWidth, hasTimetableUpdated, updateLectures } from "../../util/timetableUtils";
import { getAllDatesWithLectures, getLecturesForDate } from "../../util/store/database";
import { getCustomLecturesForDates, markDatesForCustomLectures } from "../../util/store/customLectures";
import { CalendarProvider, WeekCalendar } from "react-native-calendars";
import Timetable from "react-native-calendar-timetable";
import HourSlice from "../../components/timetable/HourSlice";
import TimeTableHeader from "../../components/timetable/TimetableHeader";
import DatePicker from "react-native-date-picker";
import IconButton from "../../components/ui/IconButton";
import LectureDetails from "../../components/timetable/LectureDetails";
import { MarkedDates } from "react-native-calendars/src/types";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { invalidateLecturesQueries, QUERY_LECTURES, QUERY_MARKED_DATES } from "../../util/http/reactQuery";
import { useTheme } from "../../context/ThemeContext";

type TimeTableScreenProps = StaticScreenProps<{
  isWeekView: boolean
}>;

let ranOnce = false

function TimeTableScreen({ route }: TimeTableScreenProps) {
  const { timetableAnimationsEnabled, defaultView } = useSettings()
  const [modalLecture, setModalLecture] = useState<Lecture | null>(null)
  const [date, setDate] = useState<Date>(new Date()) // "2025-05-05"
  const [week, setWeek] = useState(getWeekDates(date)) // TODO: maybe remove this
  const scrollRef = useRef<ScrollView>(null);
  const navigation = useNavigation()
  const { isWeekView } = route.params
  const [showDatePicker, setShowDatePicker] = useState(false)
  const route2 = useRoute()
  const { colors, theme } = useTheme()
  const queryClient = useQueryClient()
  const windowDimensions = useWindowDimensions()
  
  const updateLecturesMutation = useMutation({
    mutationFn: async (forceUpdate: boolean) => {
      const data = await getLecturesForDate("2025-06-02")
      console.log("lectures for day", data)
      const startTime = performance.now()

      if(!forceUpdate) { // if user hasnt swiped down, then this is automaticly checking for updates
        console.log("checking for timetable updates")
        const hasUpdated = await hasTimetableUpdated()
        if (!hasUpdated)
          return
        console.log("timetable updates found")
      }
      
      //await updateLectures(new Date('2025-01-01'), dateFromNow(200), true)
      await updateLectures(new Date(), dateFromNow(200), true)

      const endTime = performance.now()
      console.log(`Updating lectures took ${endTime - startTime} milliseconds`)
    },
    onSuccess: () => {
      invalidateLecturesQueries(queryClient)
    }
  })

  const { data: lectures } = useQuery<TimetableLecture[]>({
    initialData: [],
    queryKey: [QUERY_LECTURES, date, isWeekView],
    queryFn: async () => {
      console.log('querying lectures')
      let dates: Date[] = []
      if(isWeekView) {
        const WEEK = getWeekDates(date)
        dates = getDates(WEEK.from, WEEK.till)
      } else 
        dates.push(date)

      const lec: TimetableLecture[] = []

      const dataPromise = dates.map((d) => getLecturesForDate(getISODateNoTimestamp(d)))
      const data = await Promise.all(dataPromise)
      data.forEach(lectures => {
        lectures.forEach(lecture => {
          lec.push({lecture: lecture, startDate: subtrackSeconds(lecture.start_time, -60), endDate: subtrackSeconds(lecture.end_time, 60)})
        })
      });

      const customLectures: TimetableLecture[] = await getCustomLecturesForDates(dates)
      
      if(isWeekView)
        setWeek(getWeekDates(date)) // stupid

      return [...lec, ...customLectures]
    },
    networkMode: 'always',
    //staleTime: Infinity
  })

  const { data: markedDates } = useQuery<MarkedDates>({
    initialData: {},
    queryKey: [QUERY_MARKED_DATES],
    queryFn: async () => {
      const datesWithLectures = await getAllDatesWithLectures()
      const markedD: MarkedDates = {}
      datesWithLectures.forEach(item => {
        markedD[item.date] = {
          marked: true,
        }
      })
      await markDatesForCustomLectures(markedD)
      return markedD
    },
    placeholderData: keepPreviousData,
    networkMode: 'always',
    //staleTime: Infinity
  })

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return <IconButton name='calendar-clear-outline' onPress={openDatePicker} style={{
          backgroundColor: 'transparent'
        }} iconColor={colors.onBackground} />
      }
    })
  }, [colors])

  useEffect(() => { 
    if(!ranOnce) {
      ranOnce = true
      updateLecturesMutation.mutateAsync(false)
      console.log("SETTING NAVIGATION OPTIONS")
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
  }, [])

  useEffect(() =>{
    navigation.setOptions({
      title: isWeekView ? formatWeekDate(week.from, week.till) : formatDate(date)
    })
  }, [date, week])

  function lecturePressed(lecture: Lecture) {
    setModalLecture(lecture)
  }

  function openDatePicker() {
    setShowDatePicker(true)
  }

  async function onRefresh() {
    updateLecturesMutation.mutateAsync(true).catch(error => console.error(error))
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
      <LectureDetails modalVisible={!!modalLecture} lecture={modalLecture!} onRequestClose={() => {setModalLecture(null)}} />
      <DatePicker modal open={showDatePicker} date={date} onConfirm={onConfirmDate} onCancel={onCancelDate} mode="date" />
      <CalendarProvider 
        date={getISODateNoTimestamp(date)}
        onDateChanged={(newDate) => {
          setDate(new Date(newDate))
        }}
      >
        <ScrollView refreshControl={<RefreshControl refreshing={updateLecturesMutation.isPending} onRefresh={onRefresh} />} ref={scrollRef}>
        <Timetable 
          items={lectures} 
          renderItem={({key, ...props}) => <HourSlice key={key} {...props} onPress={lecturePressed} smallMode={isWeekView} animationsDisabled={!timetableAnimationsEnabled}/>} 
          date={(isWeekView ? undefined : date) as any}
          range={isWeekView ? week : undefined}

          fromHour={6}
          toHour={22}
          hourHeight={isWeekView ? 65 : 80}
          style={{
            container: {
              marginBottom: 50
            },
            timeContainer: {
              backgroundColor: colors.background
            },
            time: {
              color: colors.onBackground,
            },
            lines: {
              borderColor: colors.surfaceVariant
            },
            nowLine: {
              dot: {
                backgroundColor: theme === 'dark' ? '#F0F0F040' : '#554d5640'
              },
              line: {
                backgroundColor: theme === 'dark' ? '#F0F0F040' : '#554d5640'
              },
            }
          }}

          renderHeader={isWeekView ? props => <TimeTableHeader {...props} /> : undefined}
          columnWidth={isWeekView ? getColumnWidth(windowDimensions, isWeekView) : undefined}
        />
      </ScrollView>
        <WeekCalendar key={colors.background}
          firstDay={1}
          allowShadow={false}
          style={{
            backgroundColor: colors.background
          }}
          calendarStyle={{
            backgroundColor: colors.background
          }}
          headerStyle={{
            backgroundColor: colors.background
          }}
          contentContainerStyle={{
            backgroundColor: colors.background
          }}
          columnWrapperStyle={{
            backgroundColor: colors.background
          }}
          ListFooterComponentStyle={{
            backgroundColor: colors.background
          }}
          ListHeaderComponentStyle={{
            backgroundColor: colors.background
          }}
          theme={{
            backgroundColor: colors.background,
            dayTextColor: colors.onBackground,
            agendaTodayColor: colors.onBackground,
            selectedDayBackgroundColor: colors.primary,
            calendarBackground: colors.background,
            reservationsBackgroundColor: colors.background,
            dotColor: colors.primary,
            todayTextColor: colors.primary
          }}
                    //leftArrowImageSource={require('../img/previous.png')}
          //rightArrowImageSource={require('../img/next.png')}
          markedDates={markedDates}

        />
      </CalendarProvider>
    </Container>
  )
}

export default TimeTableScreen