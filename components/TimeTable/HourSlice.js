import { Pressable, StyleSheet, Text, View } from "react-native";
import { getTimeFromDate } from "../../util/dateUtils";
import { COLORS, isDarkTheme } from "../../constants/colors";
import { formatArray } from "../../util/timetableUtils";
import StyledText from "../ui/StyledText";
import Animated, { useSharedValue, withDelay, withSpring, withTiming } from "react-native-reanimated";
import { useEffect } from "react";
import { getDelayBasedOnPosition } from "../../util/animationUtil";

function HourSlice({style, item, dayIndex, daysTotal, onPress}) {
  const {course, eventType, start_time, end_time, note, showLink, color, colorText, rooms, groups, lecturers, executionType} = item.lecture
  const hexColor = (color === null || color === '') ? COLORS.foreground.primary : `#${color}`
  const top = useSharedValue(50)
  const opacity = useSharedValue(0)

  function onPressed() {
    onPress(item.lecture)
  }

  useEffect(() => {
    const delay = getDelayBasedOnPosition(style.top, style.left)
    top.value = withDelay(delay , withSpring(0))
    opacity.value = withDelay(delay , withTiming(1))
  }, [])

  return (
    <Pressable style={style} onPress={onPressed}>
      <Animated.View style={[styles.container, {top, opacity}]}>
          <View style={styles.titleContainer}>
            <StyledText style={styles.courseName}>{course ? course : eventType}</StyledText>
            <StyledText>{executionType}</StyledText>
          </View>
          <View style={styles.detailsContainer}>
            <StyledText style={styles.timeText}>{`${getTimeFromDate(start_time)} - ${getTimeFromDate(end_time)}`}</StyledText>
            <StyledText>{formatArray(rooms, 'name')}</StyledText>
            <StyledText>{formatArray(lecturers, 'name')}</StyledText>
          </View>
          <View>
            <StyledText style={{color: hexColor, textAlign:'right'}}>{colorText}</StyledText>
          </View>
      </Animated.View>
    </Pressable>
    
);
}

export default HourSlice

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //elevation: 5,
    backgroundColor: isDarkTheme ? COLORS.background.secondary : COLORS.background.primary,
    borderWidth: 1,
    borderColor: COLORS.background.seperator,
    padding: 5,
    overflow: 'hidden'
  },
  titleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  courseName: {
    flexGrow: 10,
    fontWeight: 'bold'
  },
  timeText: {
    fontSize: 13
  },
  detailsContainer: {
    flex: 1
  },
  bottomContainer: {
  }
})