import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SchoolCodeInputScreen from "./SchoolCodeInputScreen";
import ProgramSelectScreen from "./ProgramSelectScreen";

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
    }
  },
  screenOptions: {
    headerTitleAlign: 'center',
    headerTitleStyle: {
      fontWeight: 'bold',
      fontFamily: 'Inter'
    }
  }
})