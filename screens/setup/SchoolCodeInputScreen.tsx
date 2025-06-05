import { View, StyleSheet } from "react-native"
import Button from "../../components/ui/Button"
import Text from "../../components/ui/Text"
import TextInput from "../../components/ui/TextInput"
import { useSettings } from "../../context/UserSettingsContext"
import { useNavigation } from "@react-navigation/native"
import { setSchoolInfo, setUrlSchoolCode } from "../../util/store/schoolData"
import { useState } from "react"
import { getSchoolInfo } from "../../util/http/api"

function SchoolCodeInputScreen() {
  const { changeView } = useSettings()
  const navigation = useNavigation()
  const [code, setCode] = useState('')
  
  async function onConfirm() {
    //changeView()
    
    try {
      const schoolInfo = await getSchoolInfo(code)
      setSchoolInfo(schoolInfo)
      setUrlSchoolCode(code)
      navigation.navigate('Setup', { screen: 'ProgramSelect', params: { schoolInfo } })
    } catch (error) {
      //Alert.alert('An error ocurred', error.message)
    }
  }

  return (
    <View style={style.container}>
      
      <Text>Please write your school code</Text>
      <TextInput placeholder="School code (example: 'FERI')" value={code} onChangeText={setCode} autoCapitalize="none" autoComplete="off" />
      <Button onPress={onConfirm}>OK</Button>
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