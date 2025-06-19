import { createDrawerNavigator } from "@react-navigation/drawer";
import TimeTableScreen from "./TimeTableScreen";
import { Ionicons } from '@expo/vector-icons'
import CustomCoursesScreen from "./CustomCoursesScreen";
import OptionsScreen from "./OptionsScreen";
import AboutScreen from "./AboutScreen";
import { NAVIGATION_STYLE } from "../../util/styling";
import { Settings } from "react-native";

export const MainDrawer = createDrawerNavigator({
  screens: {
    DayView: {
      screen: TimeTableScreen,
      initialParams: { isWeekView: false },
      options: {
        drawerLabel: 'Day View',
        drawerIcon: ({ focused, color, size }) => <Ionicons name='today-outline' color={color} size={size} />
      }
    },
    WeekView: {
      screen: TimeTableScreen,
      initialParams: { isWeekView: true },
      options: {
        drawerLabel: 'Week View',
        drawerIcon: ({ focused, color, size }) => <Ionicons name='calendar-outline' color={color} size={size}/>
      }
    },
    CustomCourses: {
      screen: CustomCoursesScreen,
      options: {
        title: 'Custom Courses',
        drawerLabel: 'Add Custom Courses',
        drawerIcon: ({ focused, color, size }) => <Ionicons name='create-outline' color={color} size={size}/>
      }
    },
    Settings: {
      screen: OptionsScreen,
      options: {
        drawerIcon: ({ focused, color, size }) => <Ionicons name='settings-outline' color={color} size={size}/>
      }
    },
    About: {
      screen: AboutScreen,
      options: {
        drawerIcon: ({ focused, color, size }) => <Ionicons name='information-circle-outline' color={color} size={size}/>
      }
    }
  },
  screenOptions: NAVIGATION_STYLE as any
})