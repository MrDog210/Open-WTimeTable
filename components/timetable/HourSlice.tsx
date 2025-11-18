import Text from "../ui/Text"
import { Pressable, View, StyleSheet } from "react-native"
import { getTimeFromDate } from "../../util/dateUtils"
import { formatArray } from "../../util/timetableUtils"
import Animated, { useSharedValue, withDelay, withSpring, withTiming } from "react-native-reanimated"
import { useTheme } from "../../context/ThemeContext"
import { Lecture, TimetableLecture } from "../../types/types"
import { CardProps } from "react-native-calendar-timetable/lib/types"
import { useEffect } from "react"

interface HourSliceProps extends CardProps<TimetableLecture> {
  animationsDisabled: boolean,
  smallMode: boolean,
  onPress: (lecture: Lecture) => void,
  expand?: number
}

function getDelayBasedOnPosition(top: number, left: number) {
  return (top + left * 2) * 0.3
}

function HourSlice({style, item, onPress, smallMode = false, animationsDisabled = true, expand = 0}: HourSliceProps) {
  const {course, eventType, start_time, end_time, color, colorText, rooms, lecturers, executionType, usersNote} = item.lecture
  const { colors, theme } = useTheme()
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
  })

  const textSize = { fontSize: smallMode ? 12 : 14}
  return (
    <Pressable style={[styles.pressable, {
      ...style,
      left: style.left - expand,
      width: style.width + 2*expand
    }]} onPress={onPressed}>
      <Animated.View style={[styles.container, {top, opacity}, { backgroundColor: theme === 'dark' ? colors.surface : '#ffffffff', borderColor: colors.surfaceVariant }]}>
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

  },
  container: {
    flex: 1,
    paddingHorizontal: 5,
    paddingTop: 5,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1
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