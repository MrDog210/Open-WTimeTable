import { Pressable, View, StyleSheet, Dimensions } from "react-native"
import { CustomLecture } from "../../types/types"
import Text from "../ui/Text"
import Divider from "../ui/Divider"
import { getTimeFromDate } from "../../util/dateUtils"
import { useTheme } from "../../context/ThemeContext"
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';

const {width} = Dimensions.get('window')

type CustomCourseRowProps = {
  customCourse: CustomLecture,
  onPress: () => void,
  onLongPress: () => void,
  onSwipeDelete: () => void
}

function RightAction(prog: SharedValue<number>, drag: SharedValue<number>) {
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drag.value + width }],
    };
  });
  

  return (
    <Reanimated.View style={styleAnimation}>
      <View style={styles.rightAction}>
        <Ionicons name="trash-bin-outline" size={28} color="white" />
      </View>
    </Reanimated.View>
  );
}

function CustomCourseRow({customCourse, onPress, onLongPress, onSwipeDelete}: CustomCourseRowProps) {
  const { id, course, note, start_time, end_time, days_of_week, groups, lecturers, rooms} = customCourse
  const { colors } = useTheme()
  // TODO: fix styling
  return (
    <Swipeable
      enableTrackpadTwoFingerGesture
      renderRightActions={RightAction}
      containerStyle={{backgroundColor: 'red'}}
      onSwipeableOpen={onSwipeDelete}
    >
      <Pressable style={{backgroundColor: 'white'}} onPress={onPress} onLongPress={onLongPress} android_ripple={{color: colors.touchColor }}>
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
    width: width,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 10,
    //height: 50, 
    backgroundColor: 'red' 
  },
})