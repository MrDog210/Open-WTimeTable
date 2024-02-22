import { createDrawerNavigator } from '@react-navigation/drawer';
import TimeTableScreen from "./TimeTableScreen"
import OptionsScreen from './OptionsScreen';
import { Ionicons } from '@expo/vector-icons'
import AboutScreen from './AboutScreen';
import { useContext } from 'react';
import { UserPreferencesContext } from '../../store/userPreferencesContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GroupSelectScreen from '../setup/GroupSelectScreen';

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
      drawerIcon: ({tintColor}) => <Ionicons name='today-outline' color={tintColor} size={20}/>
    }}
    initialParams={{isWeekView: false}}
    />
    <Drawer.Screen name='WeekView' component={TimeTableScreen} 
    options={{
      drawerLabel: 'Week View',
      drawerIcon: ({tintColor}) => <Ionicons name='calendar-outline' color={tintColor} size={20}/>
    }}
      initialParams={{isWeekView: true}}
    />
    <Drawer.Screen name='Options' component={OptionsNavigaton}
     options={{
          drawerIcon: ({tintColor}) => <Ionicons name='settings-outline' color={tintColor} size={20}/>
      }}/>
    <Drawer.Screen name='About' component={AboutScreen} 
      options={{
        drawerIcon: ({tintColor}) => <Ionicons name='information-circle-outline' color={tintColor} size={20}/>
      }}
    />
  </Drawer.Navigator>
  )
}

export default MainScreen