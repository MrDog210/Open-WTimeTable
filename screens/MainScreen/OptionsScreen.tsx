import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { DefaultView, Theme, useSettings } from "../../context/UserSettingsContext"
import LoadingOverlay from "../../components/ui/LoadingOverlay"
import { ScrollView, StyleSheet } from "react-native"
import { useMutation } from "@tanstack/react-query"
import { getSchoolYearDates } from "../../util/dateUtils"
import { updateLectures } from "../../util/timetableUtils"
import Text from "../../components/ui/Text"
import Button from "../../components/ui/Button"
import { Picker } from '@react-native-picker/picker';
import { Switch } from "react-native-gesture-handler"

function OptionsScreen() {
  const { changeSettings, defaultView, timetableAnimationsEnabled, theme,  } = useSettings()
  const [fetchingDataMessage, setFetchingDataMessage] = useState('')
  const navigation = useNavigation()

  const changeSelectedGroupsMutation = useMutation({
    mutationFn: async () => {
      setFetchingDataMessage('Updating timetable, this may take a while')
      let {startDate, endDate} = getSchoolYearDates()
      console.log("Semester dates: " + startDate,endDate)
      await updateLectures(startDate, endDate)
      navigation.navigate('GroupSelect', { isEditing: true })
    }
  })

  function restartSetup() {
    changeSettings({
      hasCompletedSetup: false
    })
  }

  async function changeSelectedGroups() {
    changeSelectedGroupsMutation.mutateAsync()
  }

  function changeTheme(newTheme: Theme) {
    changeSettings({
      theme: newTheme
    })
  }

  function changeDefaultView(newDF: DefaultView) {
    changeSettings({
      defaultView: newDF
    })
  }

  function changeTimetableAnimationns(enabled: boolean) {
    changeSettings({
      timetableAnimationsEnabled: enabled
    })
  }

  return (
    <>
      <LoadingOverlay visible={changeSelectedGroupsMutation.isPending} text={fetchingDataMessage} />
      <ScrollView>
        <Text style={styles.note}>Note: this is required to do every semester</Text>
        <Button onPress={restartSetup}>Restart setup</Button>
        <Button onPress={changeSelectedGroups}>Change selected groups</Button>
        <Text>Theme</Text>
        <Picker selectedValue={theme} onValueChange={changeTheme}>
          <Picker.Item label="System" value={Theme.SYSTEM} />
          <Picker.Item label="Light" value={Theme.LIGHT} />
          <Picker.Item label="Dark" value={Theme.DARK} />
        </Picker>
        <Text>Default timetable view</Text>
        <Picker selectedValue={defaultView} onValueChange={changeDefaultView}>
          <Picker.Item label="Day view" value={DefaultView.DAY_VIEW} />
          <Picker.Item label="Week view" value={DefaultView.WEEK_VIEW} />
        </Picker>
        <Text>Default timetable view</Text>
        <Picker selectedValue={defaultView} onValueChange={changeDefaultView}>
          <Picker.Item label="Day view" value={DefaultView.DAY_VIEW} />
          <Picker.Item label="Week view" value={DefaultView.WEEK_VIEW} />
        </Picker>
        <Text>Timetable animations </Text>
        <Switch value={timetableAnimationsEnabled} onValueChange={changeTimetableAnimationns} />
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