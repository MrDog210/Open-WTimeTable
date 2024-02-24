import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useState } from "react";

export const PREF_KEYS = {
  hasCompletedSetup: 'hasCompletedSetup',
  defaultView: 'defaultView',
  language: 'language',
  darkMode: 'darkMode',
  /*timetableUpdateInterval: 'timetableUpdateInterval',
  timetableLastUpdate: 'timetableLastUpdate',
  timetableUpdateSpan: 'timetableUpdateSpan',*/
  timetableAutoScroll: 'timetableAutoScroll'
}

const userPreferences = {
  hasCompletedSetup: false,
  defaultView: 'DayView',
  language: 'en',
  darkMode: 'auto',
  /*timetableUpdateInterval: 0, // seconds since last update
  timetableLastUpdate: (new Date()).toISOString(),
  timetableUpdateSpan: 30, // in days*/
  timetableAutoScroll: true
}

export const UserPreferencesContext = createContext({
  preferences: userPreferences,
  setPreferences: async (value) => {},
  loadPreferences: async () => {},
  setKey: async (key, value) => {},
  getKey: (key) => {}
})

function UserPreferencesContextProvider({children}) {
  const [preferences, setPreferences] = useState()

  async function savePreferences(value) {
    const newValue = { ...preferences, ...value };
    setPreferences(newValue)
    await AsyncStorage.setItem('preferences', JSON.stringify(newValue))
  }

  async function setKey(key, value) {
    let p = preferences
    p[key] = value
    return savePreferences(p)
  }

  function getKey(key) {
    if(preferences === null)
      return null
    if (preferences[key]){
      return preferences[key]
    } else {
      return userPreferences[key]
    }
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
    loadPreferences: loadPreferences,
    setKey: setKey,
    getKey: getKey
  }

  return <UserPreferencesContext.Provider value={value}>{children}</UserPreferencesContext.Provider>
}

export default UserPreferencesContextProvider