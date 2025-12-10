import { Pressable, View, StyleSheet } from "react-native"
import { CustomLecture } from "../../types/types"
import Text from "../ui/Text"
import Divider from "../ui/Divider"
import { getTimeFromDate } from "../../util/dateUtils"
import { useTheme } from "../../context/ThemeContext"
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import {
  SharedValue,
} from 'react-native-reanimated';
import { Trash2 } from 'lucide-react-native'
type CustomCourseRowProps = {
  customCourse: CustomLecture,
  onPress: () => void,
  onLongPress: () => void,
  onSwipeDelete: () => void
}

function RightAction(prog: SharedValue<number>, drag: SharedValue<number>) {
  const { colors } = useTheme()

  return (
    <View style={[styles.rightAction, {backgroundColor: colors.error}]}>
      <Trash2 size={28} color={colors.onError} />
    </View>
  );
}

function CustomCourseRow({customCourse, onPress, onLongPress, onSwipeDelete}: CustomCourseRowProps) {
  const { course, start_time, end_time, days_of_week, lecturers, rooms} = customCourse
  const { colors } = useTheme()
  // TODO: fix styling
  return (
    <Swipeable
      enableTrackpadTwoFingerGesture
      renderRightActions={RightAction}
      containerStyle={{backgroundColor: 'red'}}
      onSwipeableOpen={onSwipeDelete}
      friction={1.3}
    >
      <Pressable style={{backgroundColor: colors.background }} onPress={onPress} onLongPress={onLongPress} android_ripple={{color: colors.touchColor }}>
        <View style={styles.containerStyle}>
          <View style={{flexDirection: 'row', gap: 10}}>
            <Text style={{fontWeight: 'bold'}}>{course}</Text>
            <Text>{`${getTimeFromDate(start_time)} - ${getTimeFromDate(end_time)}`}</Text>
            <Text>{rooms[0].name}</Text>
          </View>
          <Text>{lecturers[0].name}</Text>
          <Text style={{fontWeight: 'bold'}}>Days:</Text>
          <View style={{flexDirection: 'row', gap: 10}}>
            {days_of_week[0] && <Text>MON</Text>}
            {days_of_week[1] && <Text>TUE</Text>}
            {days_of_week[2] && <Text>WED</Text>}
            {days_of_week[3] && <Text>THU</Text>}
            {days_of_week[4] && <Text>FRI</Text>}
            {days_of_week[5] && <Text>SAT</Text>}
            {days_of_week[6] && <Text>SUN</Text>}
          </View>
        </View>
        <Divider style={{marginVertical: 0}} />
      </Pressable>
    </Swipeable>
  )
}

export default CustomCourseRow

const styles = StyleSheet.create({
  containerStyle: {
    padding: 10
  },
  rightAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: 15,
    backgroundColor: 'red' 
  },
})