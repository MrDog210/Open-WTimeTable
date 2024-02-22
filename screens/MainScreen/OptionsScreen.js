import { ScrollView, StyleSheet } from "react-native"
import OptionsButton from "../../components/ui/options/OptionsButton"
import OptionsDropdown from "../../components/ui/options/OptionsDropDown"
import { useContext, useEffect, useState } from "react"
import { UserPreferencesContext } from "../../store/userPreferencesContext"
import StyledText from "../../components/ui/StyledText"

function OptionsScreen({ navigation }) {
  const userPreferencesCtx = useContext(UserPreferencesContext)
  /*const [darkModeSettings, setDarkModeSettings] = useState([
    {label: 'Auto', value: 'auto'},
    {label: 'Light', value: 'light'},
    {label: 'Dark', value: 'dark'},
  ])*/
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

  return (
    <ScrollView>
      <OptionsButton title='Restart setup' onPress={restartSetup}/>
      <OptionsButton title='Change selected groups' onPress={changeSelectedGroups} />
      <StyledText style={styles.text}>Default timetable view:</StyledText>
      <OptionsDropdown items={defaultView} setItems={setDefaultView} value={selectedView} setValue={setSelectedView} />
    </ScrollView>
  )
}

export default OptionsScreen

const styles = StyleSheet.create({
  text: {
    paddingLeft: 10,
    paddingTop: 10,
    fontWeight: '500'
  }
})