import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TimeTableScreen from "./TimeTableScreen"

const BottomTabs = createBottomTabNavigator();

function MainScreen() {
  return (
  <BottomTabs.Navigator>
    <BottomTabs.Screen name='DayTimeTable' component={TimeTableScreen} />
    <BottomTabs.Screen name='WeekTimeTable' component={TimeTableScreen} />
  </BottomTabs.Navigator>
  )
}

export default MainScreen