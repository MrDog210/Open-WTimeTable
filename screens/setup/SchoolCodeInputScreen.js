import { Alert, StyleSheet,  View } from "react-native"
import StyledTextInput from "../../components/ui/StyledTextInput"
import StyledButton from "../../components/ui/StyledButton"
import Title from "../../components/ui/Title"
import {  useContext, useState } from "react"
import { getSchoolInfo } from "../../util/http"
import Spinner from 'react-native-loading-spinner-overlay';
import { SPINNER_STYLE } from "../../constants/globalStyles"
import { setSchoolInfo, setUrlSchoolCode } from "../../store/schoolInfo"
import { UserPreferencesContext } from "../../store/userPreferencesContext"

function SchoolCodeInputScreen({navigation}) {
  const [code, setCode] = useState('')
  const [isFetchingData, setIsFetchingData] = useState(false)

  function onCodeChange(code) {
    setCode(code)
  }

  async function onConfirm() {
    try {
      setIsFetchingData(true)
      const schoolInfo = await getSchoolInfo(code)
      setSchoolInfo(schoolInfo)
      setUrlSchoolCode(code)
      navigation.navigate('ProgramSelect', { schoolInfo: schoolInfo })
    } catch (error) {
      Alert.alert('An error ocurred', error.message)
    }
    setIsFetchingData(false)
  }

  const userPreferencesCtx = useContext(UserPreferencesContext)
  function changeView() {
    const pref = userPreferencesCtx.preferences // should find better way of doing this
    pref.hasCompletedSetup = true
    userPreferencesCtx.setPreferences(pref)
  }

  return (
    <View style={style.container}>
      <Spinner visible={isFetchingData} {...SPINNER_STYLE} />
      <Title>Please write your school code</Title>
      <StyledTextInput label='School code' textInputOptions={{
          placeholder: `Example: 'FERI'`, autoCapitalize: 'none', autoComplete: 'off', autoCorrect: false, onChangeText: onCodeChange, value: code
        }}/>
      <StyledButton title="OK" onPress={onConfirm}/>
      {__DEV__ && <StyledButton title="change view" onPress={changeView}/>}
    </View>
  )
}

export default SchoolCodeInputScreen

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
    gap: 10
  }
})