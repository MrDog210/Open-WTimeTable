import { ScrollView } from "react-native"
import OptionsButton from "../../components/ui/options/OptionsButton"
import OptionsDropdown from "../../components/ui/options/OptionsDropDown"
import { useContext, useEffect, useState } from "react"
import { PREF_KEYS, UserPreferencesContext } from "../../store/userPreferencesContext"

function OptionsScreen({ navigation }) {
  const userPreferencesCtx = useContext(UserPreferencesContext)
  const [darkModeSettings, setDarkModeSettings] = useState([
    {label: 'Auto', value: 'auto'},
    {label: 'Light', value: 'light'},
    {label: 'Dark', value: 'dark'},
  ])
  const [selectedTheme, setTheme] = useState(userPreferencesCtx.getKey(PREF_KEYS.darkMode))
  const [defaultView, setDefaultView] = useState([
    {label: 'Day View', value: 'DayView'},
    {label: 'Week View', value: 'WeekView'},
  ])

  const [selectedView, setSelectedView] = useState(userPreferencesCtx.preferences.defaultView)
  useEffect(() => {
    console.log(selectedView)
    let preferences = userPreferencesCtx.preferences
    preferences.defaultView = selectedView
    userPreferencesCtx.setPreferences(preferences)
  },[selectedView])

  function restartSetup() {
    const pref = userPreferencesCtx.preferences // should find better way of doing this
    pref.hasCompletedSetup = false
    userPreferencesCtx.setPreferences(pref)
  }

  function changeSelectedGroups() {
    navigation.navigate('GroupSelect', {isEditing: true})
  }

  useEffect(() => {
    userPreferencesCtx.setKey(PREF_KEYS.darkMode, selectedTheme)
  }, [selectedTheme])

  return (
    <ScrollView>
      <OptionsButton title='Restart setup' onPress={restartSetup}/>
      <OptionsButton title='Change selected groups' onPress={changeSelectedGroups} />
      <OptionsDropdown title='Default timetable view:' items={defaultView} setItems={setDefaultView} value={selectedView} setValue={setSelectedView} />
      <OptionsDropdown title='Dark mode (needs app restart)' items={darkModeSettings} setItems={setDarkModeSettings} value={selectedTheme} setValue={setTheme} />
    </ScrollView>
  )
}

export default OptionsScreen