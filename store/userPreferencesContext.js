import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useState } from "react";

const userPreferences = {
  hasCompletedSetup: false,
  defaultView: 'DayView',
  language: 'en',
  darkMode: 'auto'
}

export const UserPreferencesContext = createContext({
  preferences: userPreferences,
  setPreferences: async (value) => {},
  loadPreferences: async () => {}
})

function UserPreferencesContextProvider({children}) {
  const [preferences, setPreferences] = useState()

  async function savePreferences(value) {
    const newValue = { ...preferences, ...value };
    setPreferences(newValue)
    await AsyncStorage.setItem('preferences', JSON.stringify(newValue))
  }

  async function loadPreferences() {
    const values = await AsyncStorage.getItem('preferences')
    console.log('Saved preferences: ' + values)
    //savePreferences(userPreferences)
    //return
    
    if(values !== null){
      console.log('Parsing json')
      try {
        setPreferences(JSON.parse(values))
      } catch (error) {
        console.log(error)
        savePreferences(userPreferences)
      }
    }
    else
      setPreferences(userPreferences)
  }

  const value = {
    preferences: preferences,
    setPreferences: savePreferences,
    loadPreferences: loadPreferences
  }

  return <UserPreferencesContext.Provider value={value}>{children}</UserPreferencesContext.Provider>
}

export default UserPreferencesContextProvider