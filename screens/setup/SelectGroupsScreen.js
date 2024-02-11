import { useEffect, useLayoutEffect } from "react"
import { Text, View } from "react-native"
import { getBasicProgrammes } from "../../util/http"

function SelectGroupsScreen({route, navigation}) {
  const { schoolInfo } = route.params
  const [isFetchingData, setIsFetchingData] = useState(false)

  useLayoutEffect(() => {
    navigation.setOptions({
      title: schoolInfo.schoolName
    })
  }, [])

  useEffect(() => {
    async function fetchData() {
      setIsFetchingData(true)
      await getBasicProgrammes(schoolInfo.schoolCode)
      setIsFetchingData(false)
    }
    fetchData()
  }, [])

  return (
    <View>
      <Text>Programm:</Text>
      
    </View>
  )
}


export default SelectGroupsScreen