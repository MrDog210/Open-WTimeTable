import { createNativeStackNavigator } from "@react-navigation/native-stack"
import SchoolCodeInputScreen from "./SchoolCodeInputScreen"
import { COLORS } from "../../constants/colors"

const Stack = createNativeStackNavigator()

function SetupScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CodeInput" component={SchoolCodeInputScreen} options={{headerShown: false}} />
    </Stack.Navigator>
  )
}

export default SetupScreen