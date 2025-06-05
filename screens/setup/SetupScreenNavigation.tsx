import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SchoolCodeInputScreen from "./SchoolCodeInputScreen";
import ProgramSelectScreen from "./ProgramSelectScreen";

export default createNativeStackNavigator({
  screens: {
    SchoolCodeInput: {
      screen: SchoolCodeInputScreen
    },
    ProgramSelect: {
      screen: ProgramSelectScreen
    }
  }
})