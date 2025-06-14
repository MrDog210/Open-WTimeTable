import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SchoolCodeInputScreen from "./SchoolCodeInputScreen";
import ProgramSelectScreen from "./ProgramSelectScreen";
import GroupSelectScreen from "./GroupSelectScreen";

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
  screenOptions: {
    headerTitleAlign: 'center',
    headerTitleStyle: {
      fontWeight: 'bold',
      fontFamily: 'Inter'
    },
    headerShadowVisible: false
    //headerBackground: () => <></>
  }
})