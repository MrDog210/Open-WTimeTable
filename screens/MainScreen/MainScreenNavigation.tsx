import { createDrawerNavigator } from "@react-navigation/drawer";
import TimeTableScreen from "./TimeTableScreen";

export const MainDrawer = createDrawerNavigator({
  screens: {
    DayView: {
      screen: TimeTableScreen
    },
    WeekView: {
      screen: TimeTableScreen
    }
  }
})