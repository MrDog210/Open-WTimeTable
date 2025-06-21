import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { DefaultView, Theme, useSettings } from "../../context/UserSettingsContext"
import LoadingOverlay from "../../components/ui/LoadingOverlay"
import { Alert, ScrollView, StyleSheet, View } from "react-native"
import { useMutation } from "@tanstack/react-query"
import { getSchoolYearDates } from "../../util/dateUtils"
import { updateLectures } from "../../util/timetableUtils"
import Text from "../../components/ui/Text"
import { Picker, PickerItemProps, PickerProps } from '@react-native-picker/picker';
import SettingsButton from "../../components/optionsScreen/SettingsButton"
import { useTheme } from "../../context/ThemeContext"
import Switch from "../../components/ui/Switch"

function OptionsScreen() {
  const { changeSettings, defaultView, timetableAnimationsEnabled, theme,  } = useSettings()
  const [fetchingDataMessage, setFetchingDataMessage] = useState('')
  const navigation = useNavigation()
  const {colors} = useTheme()

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
    try {
      await changeSelectedGroupsMutation.mutateAsync()
    } catch (error) {
      if (error instanceof Error) {
        console.error(error)
        Alert.alert('Error', error.message)
      }
    }
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
  
  const pickerStyle: Partial<PickerProps> = {
    dropdownIconColor: colors.onBackground,
    dropdownIconRippleColor: colors.touchColor,
    itemStyle: {
      color: colors.onBackground,
      //textAlign: 'right'
    },
    style: {
      flex: 2
      //height: 54,
      //textAlign: 'right'
    }
  }

  const pickerItmeStyle: Partial<PickerItemProps> = {
    color: colors.onBackground,
    //fontFamily: ''
  }

  return (
    <>
      <LoadingOverlay visible={changeSelectedGroupsMutation.isPending} text={fetchingDataMessage} />
      <ScrollView contentContainerStyle={styles.containerStyle}>
        <Text style={styles.header}>General</Text>
        <SettingsButton onPress={restartSetup}>Restart setup</SettingsButton>
        <SettingsButton onPress={changeSelectedGroups}>Change selected groups</SettingsButton>
        <Text style={styles.header}>Appearance</Text>
        <View style={styles.pickerContainer}>
          <Text style={{alignSelf: 'center', flex: 3}}>Theme</Text>
          <Picker 
            {...pickerStyle}
            selectedValue={theme} onValueChange={changeTheme}>
            <Picker.Item {...pickerItmeStyle} label="System" value={Theme.SYSTEM} />
            <Picker.Item {...pickerItmeStyle} label="Light" value={Theme.LIGHT} />
            <Picker.Item {...pickerItmeStyle} label="Dark" value={Theme.DARK} />
          </Picker>
        </View>
        <View style={styles.pickerContainer}>
          <Text style={{alignSelf: 'center', flex: 3}}>Default timetable view</Text>
          <Picker {...pickerStyle} selectedValue={defaultView} onValueChange={changeDefaultView}>
            <Picker.Item {...pickerItmeStyle} label="Day view" value={DefaultView.DAY_VIEW} />
            <Picker.Item {...pickerItmeStyle} label="Week view" value={DefaultView.WEEK_VIEW} />
          </Picker>
        </View>
        <View style={styles.switchContainer}>
          <Text style={{alignSelf: 'center'}}>Timetable animations</Text>
          <Switch value={timetableAnimationsEnabled} onValueChange={changeTimetableAnimationns} />
        </View>
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
  },
  containerStyle: {
    paddingHorizontal: 15
  },
  header: {
    fontWeight: 700,
    fontSize: 18,
    paddingVertical: 5
  },
  switchContainer: { 
    flexDirection: 'row',
    //alignContent: 'center',
    justifyContent: 'space-between',
    height: 54
  },
  pickerContainer: {
    flexDirection: 'row',
    //alignContent: 'center',
    justifyContent: 'space-between',
    height: 54
  }
})