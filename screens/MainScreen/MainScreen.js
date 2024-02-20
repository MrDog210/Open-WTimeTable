import { createDrawerNavigator } from '@react-navigation/drawer';
import TimeTableScreen from "./TimeTableScreen"
import OptionsScreen from './OptionsScreen';
import { Ionicons } from '@expo/vector-icons'
import AboutScreen from './AboutScreen';

const Drawer = createDrawerNavigator();

function MainScreen() {
  //return <TimeTableScreen />
  return (
  <Drawer.Navigator>
    <Drawer.Screen name='DayTimeTable' component={TimeTableScreen} 
    options={{
      drawerLabel: 'Day view',
      drawerIcon: ({tintColor}) => <Ionicons name='today-outline' color={tintColor} size={20}/>
    }}
    />
    <Drawer.Screen name='WeekTimeTable' component={TimeTableScreen} 
    options={{
      drawerLabel: 'Week view',
      drawerIcon: ({tintColor}) => <Ionicons name='calendar-outline' color={tintColor} size={20}/>
    }}/>
    <Drawer.Screen name='Options' component={OptionsScreen} 
      options={{
        drawerIcon: ({tintColor}) => <Ionicons name='settings-outline' color={tintColor} size={20}/>
      }}
    />
    <Drawer.Screen name='About' component={AboutScreen} 
      options={{
        drawerIcon: ({tintColor}) => <Ionicons name='information-circle-outline' color={tintColor} size={20}/>
      }}
    />
  </Drawer.Navigator>
  )
}

export default MainScreen