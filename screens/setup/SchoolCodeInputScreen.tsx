import { StyleSheet, KeyboardAvoidingView, Platform } from "react-native"
import TextInput from "../../components/ui/TextInput"
import { useSettings } from "../../context/UserSettingsContext"
import { useNavigation } from "@react-navigation/native"
import { setSchoolInfo, setUrlSchoolCode } from "../../util/store/schoolData"
import { useEffect, useState } from "react"
import { getSchoolInfo } from "../../util/http/api"
import { useMutation } from "@tanstack/react-query"
import Container from "../../components/ui/Container"
import { init } from "../../util/store/databse"
import { Text, Button, HelperText } from "react-native-paper"

let hasCreatedDatabase = false

function SchoolCodeInputScreen() {
  const { changeView } = useSettings()
  const navigation = useNavigation()
  const [code, setCode] = useState('')
  
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
    //changeView()
    
    try {
      const schoolInfo = await schoolInfoMutation.mutateAsync(code)
      navigation.navigate('Setup', { screen: 'ProgramSelect', params: { schoolInfo } })
    } catch (error) {
      if (error instanceof Error) {
        //Alert.alert('An error ocurred', error.message)
      }
    }
  }

  return (
    <Container style={style.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={style.inputContainer}>
        <Text variant="titleLarge" style={{textAlign: 'center', fontWeight: 'bold'}} >Enter your school code</Text>
        <TextInput placeholder="School code (example: 'FERI')" value={code} onChangeText={setCode} autoCapitalize="none" autoComplete="off" />
        <HelperText type="error" visible={schoolInfoMutation.isError}>Invalid school code</HelperText>
      </KeyboardAvoidingView>
      <Button mode="contained" loading={schoolInfoMutation.isPending} disabled={schoolInfoMutation.isPending} onPress={onConfirm}>OK</Button>
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