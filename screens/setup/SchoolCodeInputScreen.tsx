import { StyleSheet, KeyboardAvoidingView, Platform, Alert } from "react-native"
import Button from "../../components/ui/Button"
import Text from "../../components/ui/Text"
import TextInput from "../../components/ui/TextInput"
import { useNavigation } from "@react-navigation/native"
import { setSchoolInfo, setUrlSchoolCode } from "../../util/store/schoolData"
import { useEffect, useState } from "react"
import { getSchoolInfo } from "../../util/http/api"
import { useMutation } from "@tanstack/react-query"
import Container from "../../components/ui/Container"
import { init } from "../../util/store/database"
import { useSettings } from "../../context/UserSettingsContext"
import { useTheme } from "../../context/ThemeContext"

let hasCreatedDatabase = false

function SchoolCodeInputScreen() {
  const navigation = useNavigation()
  const [code, setCode] = useState('')
  const { changeSettings } = useSettings()
  const { colors } = useTheme()
  
  const schoolInfoMutation = useMutation({
    mutationFn: async (code: string) => {
      const schoolInfo = await getSchoolInfo(code)
      await setSchoolInfo(schoolInfo)
      await setUrlSchoolCode(code)
      return schoolInfo
    }
  })

  useEffect(() => {
    if(!hasCreatedDatabase) {
      hasCreatedDatabase = true;
      init()
    }
  }, [])

  async function onConfirm() {
    try {
      const schoolInfo = await schoolInfoMutation.mutateAsync(code)
      navigation.navigate('Setup', { screen: 'ProgramSelect', params: { schoolInfo } })
    } catch (error) {
      if(error instanceof Error) {
        Alert.alert('An error ocurred', error.message)
        console.error(error)
      }
    }
  }

  return (
    <Container style={style.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={style.inputContainer}>
        <Text style={{fontSize: 28, fontWeight: 'bold', textAlign: 'center'}}>Enter your school code</Text>
        <TextInput placeholder="School code (example: 'FERI')" value={code} onChangeText={setCode} autoCapitalize="none" autoComplete="off" />
        { schoolInfoMutation.isError && <Text style={{color: colors.error, fontSize: 14}}>Invalid school code</Text>}
      </KeyboardAvoidingView>
      <Button loading={schoolInfoMutation.isPending} disabled={schoolInfoMutation.isPending || code.length === 0} onPress={onConfirm}>OK</Button>
      {__DEV__ && <Button onPress={() => changeSettings({ hasCompletedSetup: true })}>change view</Button>}
    </Container>
  )
}

export default SchoolCodeInputScreen

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 15,
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 10
  }
})