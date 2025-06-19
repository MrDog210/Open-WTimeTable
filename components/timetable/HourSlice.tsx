import Text from "../ui/Text"
import { Pressable, View, StyleSheet } from "react-native"
import { getTimeFromDate } from "../../util/dateUtils"
import { formatArray } from "../../util/timetableUtils"
import Animated, { useSharedValue, withDelay, withSpring, withTiming } from "react-native-reanimated"
import { useTheme } from "../../context/ThemeContext"
import { Lecture, TimetableLecture } from "../../types/types"
import { CardProps } from "react-native-calendar-timetable/lib/types"
import { useEffect } from "react"

interface HourSlice extends CardProps<TimetableLecture> {
  animationsDisabled: boolean,
  smallMode: boolean,
  onPress: (lecture: Lecture) => void,
}

function getDelayBasedOnPosition(top: number, left: number) {
  return (top + left * 2) * 0.3
}

function HourSlice({style, item, onPress, smallMode = false, animationsDisabled = true}: HourSlice) {
  const {course, eventType, start_time, end_time, note, showLink, color, colorText, rooms, groups, lecturers, executionType, usersNote} = item.lecture
  const { colors } = useTheme()
  const hexColor = (color === null || color === '') ? colors.onBackground : `#${color}`

  const top = useSharedValue(animationsDisabled ? 0 : 50)
  const opacity = useSharedValue(animationsDisabled ? 1 : 0)

  function onPressed() {
    onPress(item.lecture)
  }

  useEffect(() => {
    const delay = getDelayBasedOnPosition(style.top, style.left)
    top.value = withDelay(delay , withSpring(0))
    opacity.value = withDelay(delay , withTiming(1, {duration: 500}))
  }, [])

  const textSize = { fontSize: smallMode ? 12 : 14}
  // TODO: in week view, make slices wider
  return (
    <Pressable style={[styles.pressable, style, { backgroundColor: colors.surface, borderColor: colors.surfaceVariant }]} onPress={onPressed}>
      <Animated.View style={[styles.container, {top, opacity}]}>
          <View style={styles.titleContainer}>
            <View style={styles.courseNameContainer}>
              <Text style={[styles.courseName, textSize]} numberOfLines={0}>{course ? course : eventType}</Text>
            </View>
            <Text style={[styles.executionType, textSize]}>{executionType}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.timeText}>{`${getTimeFromDate(start_time)} - ${getTimeFromDate(end_time)}`}</Text>
            <Text style={textSize}>{formatArray(rooms, 'name')}</Text>
            <Text style={textSize}>{formatArray(lecturers, 'name')}</Text>
          </View>
          <View style={styles.bottomContainer}>
            {usersNote && <Text style={[{/*color: COLORS.foreground.secondary,*/textAlign:'left'}, textSize]}>{usersNote.note}</Text>}
            {colorText && <Text style={[{color: hexColor, textAlign:'right'}, textSize]}>{colorText}</Text>}
          </View>
      </Animated.View>
    </Pressable> 
  );
}

export default HourSlice

const styles = StyleSheet.create({
  pressable: {
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1
  },
  container: {
    flex: 1,
    paddingHorizontal: 5,
    paddingTop: 5,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  courseNameContainer: {
    flex: 1,
  },
  courseName: {
    fontWeight: 'bold',
    flexShrink: 1,
  },
  executionType: {
    flexShrink: 0,
  },
  timeText: {
    fontSize: 12
  },
  detailsContainer: {
    flex: 1,
    overflow: 'hidden'
  },
  bottomContainer: {
    flexDirection: 'row'
  }
})