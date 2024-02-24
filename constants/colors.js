import { Appearance } from "react-native";

const colorScheme = Appearance.getColorScheme();
const isDarkTheme = colorScheme === 'dark'

export var COLORS = {
  foreground: {
    primary: isDarkTheme ? '#F0F0F0' : '#554d56',
    secondary: isDarkTheme ? '#CBCBCB' : '#979197',
    warning: isDarkTheme ? '#ee6723' : '#ee6723',
    accent: isDarkTheme ? '#419bf9' : '#419bf9',
    accentDisabled: isDarkTheme ? '#8CC3FC' : '#8CC3FC',
    accentPressed: isDarkTheme ? '#4684C8' : '#4684C8' 
  },
  background: {
    primary: isDarkTheme ? '#1A1A1A' : 'white' ,
    secondary: isDarkTheme ? '#2C2C2C' : '#fbfbfb',
    seperator: isDarkTheme ? '#454545' : '#E6E3E6',
    primaryOpaque: isDarkTheme ? '#1A1A1A99' : '#ffffff99'
  }
}