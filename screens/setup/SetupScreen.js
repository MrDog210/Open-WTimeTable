import { createNativeStackNavigator } from "@react-navigation/native-stack"
import SchoolCodeInputScreen from "./SchoolCodeInputScreen"
import ProgramSelectScreen from "./ProgramSelectScreen"
import GroupSelectScreen from "./GroupSelectScreen"
import { useEffect } from 'react';
import { init } from "../../util/database"

const Stack = createNativeStackNavigator()

function SetupScreen() {
  useEffect(() => {
    init()
  }, []) // se pokliče, ko prvič odperemo app

  return (
    <Stack.Navigator>
      <Stack.Screen name="CodeInput" component={SchoolCodeInputScreen} options={{headerShown: false}} />
      <Stack.Screen name="ProgramSelect" component={ProgramSelectScreen} />
      <Stack.Screen name="SelectGroups" component={GroupSelectScreen} options={{headerTitle: 'Select your program groups'}}/>
    </Stack.Navigator>
  )
}

export default SetupScreen