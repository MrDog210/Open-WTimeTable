import { Alert, StyleSheet, Text, View } from "react-native"
import StyledTextInput from "../../components/ui/StyledTextInput"
import StyledButton from "../../components/ui/StyledButton"
import Title from "../../components/ui/Title"
import { useState } from "react"
import { getSchoolInfo } from "../../util/http"
import Spinner from 'react-native-loading-spinner-overlay';
import { getAllGroups, getAllLectures, insertCourse, insertGroup, insertLecture } from "../../util/database"

const DUMMY_LECTUR = {
  "id": "S2585",
  "start_time": "2023-11-27T07:00:00",
  "end_time": "2023-11-27T10:00:00",
  "courseId": "540",
  "course": "OPERACIJSKI SISTEMI",
  "eventType": "",
  "note": "",
  "executionTypeId": "5",
  "executionType": "RV",
  "branches": [
      {
          "id": 59,
          "name": "BU20-R"
      }
  ],
  "rooms": [
      {
          "id": 130,
          "name": "(RU) E-110"
      }
  ],
  "groups": [
      {
          "id": 596,
          "name": "RIT 2 UN RV 6"
      }
  ],
  "lecturers": [
      {
          "id": 598,
          "name": "MARTIN ŠAVC"
      }
  ],
  "showLink": "",
  "color": "",
  "colorText": ""
}

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
      navigation.navigate('ProgramSelect', { schoolInfo: schoolInfo })
    } catch (error) {
      Alert.alert('An error ocurred', error.message)
    }
    setIsFetchingData(false)
  }

  function sraje() {
    //insertGroup(0, 'To je ime coursa')
    //getAllGroups()
    insertLecture(DUMMY_LECTUR)
    getAllLectures()
  }

  return (
    <View style={style.container}>
      <Spinner visible={isFetchingData} />
      <Title>Please write your school code</Title>
      <StyledTextInput label='School code' textInputOptions={{
        placeholder: 'FERI', autoCapitalize: 'none', autoComplete: 'off', autoCorrect: false, onChangeText: onCodeChange, value: code
        }}/>
      <StyledButton title="OK" onPress={onConfirm}/>
      <StyledButton title='testiraj' onPress={sraje} />
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