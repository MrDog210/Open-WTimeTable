import { Alert, StyleSheet, Text, View } from "react-native"
import StyledTextInput from "../../components/ui/StyledTextInput"
import StyledButton from "../../components/ui/StyledButton"
import Title from "../../components/ui/Title"
import { useState } from "react"
import { getSchoolInfo } from "../../util/http"

function SchoolCodeInputScreen({navigation}) {
  const [code, setCode] = useState('')

  function onCodeChange(code) {
    setCode(code)
  }

  async function onConfirm() {
    try {
      const schoolInfo = await getSchoolInfo(code)
      navigation.navigate('SelectGroups', { schoolInfo: schoolInfo })
    } catch (error) {
      Alert.alert('An error ocurred', error.message)
    }
  }

  return (
    <View style={style.container}>
      <Title>Please write your school code</Title>
      <StyledTextInput label='School code' textInputOptions={{
        placeholder: 'FERI', autoCapitalize: 'none', autoComplete: 'off', autoCorrect: false, onChangeText: onCodeChange, value: code
        }}/>
      <StyledButton title="OK" onPress={onConfirm}/>
    </View>
  )
}

export default SchoolCodeInputScreen

const style = StyleSheet.create({
  container: {
    flex: 1,
    //alignContent: 'center',
    justifyContent: 'center'
  }
})