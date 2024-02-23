import { createDrawerNavigator } from '@react-navigation/drawer';
import TimeTableScreen from "./TimeTableScreen"
import OptionsScreen from './OptionsScreen';
import { Ionicons } from '@expo/vector-icons'
import AboutScreen from './AboutScreen';
import { useContext } from 'react';
import { UserPreferencesContext } from '../../store/userPreferencesContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GroupSelectScreen from '../setup/GroupSelectScreen';
import { DarkTheme } from '@react-navigation/native';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function OptionsNavigaton() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Drawer.Screen name='OptionsMain' component={OptionsScreen} />
      <Stack.Screen name='GroupSelect' component={GroupSelectScreen} />
    </Stack.Navigator>
  )
}

function MainScreen() {
  const userPreferencesCtx = useContext(UserPreferencesContext)
  //return <TimeTableScreen />
  return (
  <Drawer.Navigator initialRouteName={userPreferencesCtx.preferences.defaultView}>
    <Drawer.Screen name='DayView' component={TimeTableScreen} 
    options={{
      drawerLabel: 'Day View',
      drawerIcon: ({ focused, color, size }) => <Ionicons name='today-outline' color={color} size={size}/>
    }}
    initialParams={{isWeekView: false}}
    />
    <Drawer.Screen name='WeekView' component={TimeTableScreen} 
    options={{
      drawerLabel: 'Week View',
      drawerIcon: ({ focused, color, size }) => <Ionicons name='calendar-outline' color={color} size={size}/>
    }}
      initialParams={{isWeekView: true}}
    />
    <Drawer.Screen name='Options' component={OptionsNavigaton}
     options={{
          drawerIcon: ({ focused, color, size }) => <Ionicons name='settings-outline' color={color} size={size}/>
      }}/>
    <Drawer.Screen name='About' component={AboutScreen} 
      options={{
        drawerIcon: ({ focused, color, size }) => <Ionicons name='information-circle-outline' color={color} size={size}/>
      }}
    />
  </Drawer.Navigator>
  )
}

export default MainScreen