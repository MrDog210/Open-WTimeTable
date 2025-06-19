import { DrawerNavigationOptions } from "@react-navigation/drawer";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";

export const NAVIGATION_STYLE: NativeStackNavigationOptions | DrawerNavigationOptions = {
    headerTitleAlign: 'center',
    headerTitleStyle: {
      fontWeight: 'bold',
      //fontFamily: 'Inter' // TODO: change font
      ////fontSize: 20
    },
    headerShadowVisible: false,
    headerStyle: {
      backgroundColor: 'transparent'
    }
}