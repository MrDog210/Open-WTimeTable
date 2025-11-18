/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigation, useRoute, type StaticScreenProps } from "@react-navigation/native";
import Container from "../../components/ui/Container";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { DefaultView, useSettings } from "../../context/UserSettingsContext";
import { Lecture, TimetableLecture } from "../../types/types";
import { dateFromNow, formatDate, formatWeekDate, getISODateNoTimestamp, getSchoolWeekNumber, getWeekDates } from "../../util/dateUtils";
import { RefreshControl, ScrollView, StyleSheet, useWindowDimensions, View, } from "react-native";
import { calculateNowLineOffset, getAllLecturesForDay, getColumnWidth, hasTimetableUpdated, updateLectures } from "../../util/timetableUtils";
import { getAllDatesWithLectures } from "../../util/store/database";
import { markDatesForCustomLectures } from "../../util/store/customLectures";
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
import Text from "../../components/ui/Text";
import dayjs from "dayjs";
import { AnimatedRollingNumber } from "react-native-animated-rolling-numbers";
import { Directions, Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

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

  function shiftDate(days: number) {
    setDate(prev => dayjs(prev).add(days, 'day').toDate());
  };

  const DISTANCE_THRESHOLD = 50; // px horizontal moved
  const VELOCITY_THRESHOLD = 700; // px/s — how "fast" the swipe must be

  const swipeGesture = Gesture.Pan()
    .enabled(!isWeekView)
    .activeOffsetX([-10, 10])
    .failOffsetY([-15, 15])
    .onEnd((event) => {
      'worklet';
      const { translationX, velocityX } = event;
      if (translationX > DISTANCE_THRESHOLD && velocityX > VELOCITY_THRESHOLD) {
        runOnJS(shiftDate)(-1);
      } else if (translationX < -DISTANCE_THRESHOLD && velocityX < -VELOCITY_THRESHOLD) {
        runOnJS(shiftDate)(1);
      }
    });

  const updateLecturesMutation = useMutation({
    mutationFn: async (forceUpdate: boolean) => {
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
      const data = await getAllLecturesForDay(date, isWeekView)
      
      if(isWeekView)
        setWeek(getWeekDates(date)) // stupid

      return data
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
        return <>
          <IconButton name='calendar-clear-outline' onPress={openDatePicker} style={{
          backgroundColor: 'transparent'
          }} iconColor={colors.onBackground} />
          <IconButton name='calendar-number-outline' onPress={() => setDate(new Date)} style={{
            backgroundColor: 'transparent'
          }} iconColor={colors.onBackground} />
        </>
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
      title: isWeekView ? formatWeekDate(week.from, week.till) : dayjs(date).format('ddd, D MMMM')
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

  const WeekNum = useMemo(() => <AnimatedRollingNumber key={theme} textStyle={{fontSize: 16, color: colors.onBackground}} value={getSchoolWeekNumber(date)} />, [date, theme])
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
        <GestureDetector gesture={swipeGesture} >
        <Timetable 
          items={lectures} 
          renderItem={({key, ...props}) => <HourSlice key={key} expand={isWeekView ? 8 : 0} {...props} onPress={lecturePressed} smallMode={isWeekView} animationsDisabled={!timetableAnimationsEnabled}/>} 
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
        </GestureDetector>
      </ScrollView>
      { !isWeekView ? 
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
        /> : 
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 8}}>
          <View style={styles.arrowButtonContainerStyle}>
            <IconButton iconColor={colors.onBackground} name="chevron-back-outline"  style={{ backgroundColor: 'transparent'}} onPress={() => setDate(dayjs(date).subtract(1, 'week').toDate())} />
          </View>
          <View style={{alignItems: 'center'}}>
            <Text style={{color: colors.onBackground}}>Week</Text>
            {WeekNum}
          </View>
          <View style={styles.arrowButtonContainerStyle}>
            <IconButton iconColor={colors.onBackground} name="chevron-forward-outline" style={{ backgroundColor: 'transparent'}} onPress={() => setDate(dayjs(date).add(1, 'week').toDate())}/>
          </View>
        </View>}
      </CalendarProvider>
    </Container>
  )
}

export default TimeTableScreen

const styles = StyleSheet.create({
  arrowButtonContainerStyle: {
    borderRadius: 32, 
    overflow: 'hidden'
  }
})