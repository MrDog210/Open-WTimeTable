import { createDrawerNavigator } from "@react-navigation/drawer";
import TimeTableScreen from "./TimeTableScreen";
import CustomCoursesScreen from "./CustomCoursesScreen";
import OptionsScreen from "./OptionsScreen";
import AboutScreen from "./AboutScreen";
import { NAVIGATION_STYLE } from "../../util/styling";
import { CalendarDays, CalendarRange, CalendarPlus2, Settings, Info } from 'lucide-react-native'

export const MainDrawer = createDrawerNavigator({
  screens: {
    DayView: {
      screen: TimeTableScreen,
      initialParams: { isWeekView: false },
      options: {
        drawerLabel: 'Day View',
        drawerIcon: ({ focused, color, size }) => <CalendarDays color={color} size={size} />
      }
    },
    WeekView: {
      screen: TimeTableScreen,
      initialParams: { isWeekView: true },
      options: {
        drawerLabel: 'Week View',
        drawerIcon: ({ focused, color, size }) => <CalendarRange color={color} size={size} />
      }
    },
    CustomCourses: {
      screen: CustomCoursesScreen,
      options: {
        title: 'Custom Courses',
        drawerLabel: 'Add Custom Courses',
        drawerIcon: ({ focused, color, size }) => <CalendarPlus2 color={color} size={size}/>
      }
    },
    Settings: {
      screen: OptionsScreen,
      options: {
        drawerIcon: ({ focused, color, size }) => <Settings color={color} size={size}/>
      }
    },
    About: {
      screen: AboutScreen,
      options: {
        drawerIcon: ({ focused, color, size }) => <Info color={color} size={size}/>
      }
    }
  },
  screenOptions: NAVIGATION_STYLE as any
})