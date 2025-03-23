import { Alert, Modal, ScrollView, StyleSheet } from "react-native"
import OptionsButton from "../../components/ui/options/OptionsButton"
import OptionsDropdown from "../../components/ui/options/OptionsDropDown"
import { useContext, useEffect, useState } from "react"
import { PREF_KEYS, UserPreferencesContext } from "../../store/userPreferencesContext"
import StyledText from "../../components/ui/StyledText"
import OptionsSwitch from "../../components/ui/options/OptionsSwitch"
import { updateLectures } from "../../util/timetableUtils"
import { getSchoolYearDates } from "../../util/dateUtils"
import Spinner from "react-native-loading-spinner-overlay"
import { SPINNER_STYLE } from "../../constants/globalStyles"
import { hasInternetConnection } from "../../util/http"
import EditCustomCoursesScreen from "./EditCustomCoursesScreen"

function OptionsScreen({ navigation }) {
  const userPreferencesCtx = useContext(UserPreferencesContext)
  const [isFetchingData, setIsFetchingData] = useState(false)
  const [fetchingDataMessage, setFetchingDataMessage] = useState('')
  const [isEditCustomCoursesVisible, setIsEditCustomCoursesVisible] = useState(false)

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

  const [timetableAnimations, setTimetableAnimations] = useState(userPreferencesCtx.getKey(PREF_KEYS.timetableAnimations))

  function restartSetup() {
    const pref = userPreferencesCtx.preferences // should find better way of doing this
    pref.hasCompletedSetup = false
    userPreferencesCtx.setPreferences(pref)
  }

  async function changeSelectedGroups() {
    setFetchingDataMessage('Updating timetable, this may take a while')
    setIsFetchingData(true)
    const hasInternet = await hasInternetConnection()
    if(!hasInternet){ 
      Alert.alert('Error', 'No internet connection')
      return
    }
    let {startDate, endDate} = getSchoolYearDates()
    console.log("Semester dates: " + startDate,endDate)
    await updateLectures(startDate, endDate)
    navigation.navigate('GroupSelect', {isEditing: true})
    setIsFetchingData(false)
  }

  function onEditCustomCoursesPressed() {
    setIsEditCustomCoursesVisible(true)
  }

  useEffect(() => {
    userPreferencesCtx.setKey(PREF_KEYS.timetableAnimations, timetableAnimations)
  }, [timetableAnimations])

  return (
    <>
    <Modal visible={isEditCustomCoursesVisible} onRequestClose={() => setIsEditCustomCoursesVisible(false)}>
      <EditCustomCoursesScreen />
    </Modal>
    <Spinner visible={isFetchingData} {...SPINNER_STYLE} textContent={fetchingDataMessage} />
    <ScrollView>
      <StyledText style={styles.note}>Note: this is required to do every semester</StyledText>
      <OptionsButton title='Restart setup' onPress={restartSetup}/>
      <OptionsButton title='Change selected groups' onPress={changeSelectedGroups} />
      <OptionsDropdown title='Default timetable view:' items={defaultView} setItems={setDefaultView} value={selectedView} setValue={setSelectedView} />
      <OptionsSwitch value={timetableAnimations} onValueChange={setTimetableAnimations} title='Timetable animations' />
      <OptionsButton title='Edit custom courses' onPress={onEditCustomCoursesPressed} />
    </ScrollView>
    </>
  )
}

export default OptionsScreen

const styles = StyleSheet.create({
  note: {
    paddingLeft: 10,
    paddingTop: 10,
    fontSize: 10
  }
})