import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { useSettings } from "../../context/UserSettingsContext"
import LoadingOverlay from "../../components/ui/LoadingOverlay"
import { ScrollView, StyleSheet } from "react-native"
import { useMutation } from "@tanstack/react-query"
import { getSchoolYearDates } from "../../util/dateUtils"
import { updateLectures } from "../../util/timetableUtils"
import Text from "../../components/ui/Text"
import Button from "../../components/ui/Button"
import { Picker } from '@react-native-picker/picker';

function OptionsScreen() {
  const { changeSettings, defaultView, timetableAnimationsEnabled, theme } = useSettings()
  const [fetchingDataMessage, setFetchingDataMessage] = useState('')
  const navigation = useNavigation()
  /*const [darkModeSettings, setDarkModeSettings] = useState([
    {label: 'Auto', value: 'auto'},
    {label: 'Light', value: 'light'},
    {label: 'Dark', value: 'dark'},
  ])*/
  /* const [defaultView, setDefaultView] = useState([
    {label: 'Day View', value: 'DayView'},
    {label: 'Week View', value: 'WeekView'},
  ]) */

  const changeSelectedGroupsMutation = useMutation({
    mutationFn: async () => {
      setFetchingDataMessage('Updating timetable, this may take a while')
      let {startDate, endDate} = getSchoolYearDates()
      console.log("Semester dates: " + startDate,endDate)
      await updateLectures(startDate, endDate)
      navigation.navigate('GroupSelect', { isEditing: true })
    }
  })
/* 
  const [selectedView, setSelectedView] = useState(userPreferencesCtx.preferences.defaultView)
  useEffect(() => {
    console.log(selectedView)
    let preferences = userPreferencesCtx.preferences
    preferences.defaultView = selectedView
    userPreferencesCtx.setPreferences(preferences)
  },[selectedView]) */

  function restartSetup() {
    changeSettings({
      hasCompletedSetup: false
    })
  }

  async function changeSelectedGroups() {
    changeSelectedGroupsMutation.mutateAsync()
  }

  /* useEffect(() => {
    userPreferencesCtx.setKey(PREF_KEYS.timetableAnimations, timetableAnimations)
  }, [timetableAnimations])

 */  return (
    <>
      <LoadingOverlay visible={changeSelectedGroupsMutation.isPending} text={fetchingDataMessage} />
      <ScrollView>
        <Text style={styles.note}>Note: this is required to do every semester</Text>
        <Button onPress={restartSetup}>Restart setup</Button>
        <Button onPress={changeSelectedGroups}>Change selected groups</Button>
        <Picker></Picker>
        {/* <OptionsDropdown title='Default timetable view:' items={defaultView} setItems={setDefaultView} value={selectedView} setValue={setSelectedView} />
        <OptionsSwitch value={timetableAnimations} onValueChange={setTimetableAnimations} title='Timetable animations' /> */}
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