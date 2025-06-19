import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SchoolCodeInputScreen from "./SchoolCodeInputScreen";
import ProgramSelectScreen from "./ProgramSelectScreen";
import GroupSelectScreen from "./GroupSelectScreen";
import { NAVIGATION_STYLE } from "../../util/styling";

export default createNativeStackNavigator({
  screens: {
    SchoolCodeInput: {
      screen: SchoolCodeInputScreen,
      options: {
        headerShown: false
      }
    },
    ProgramSelect: {
      screen: ProgramSelectScreen
    },
    GroupSelect: {
      screen: GroupSelectScreen,
      options: {
        title: 'Select groups for lectures'
      }
    }
  },
  screenOptions: NAVIGATION_STYLE as any
})