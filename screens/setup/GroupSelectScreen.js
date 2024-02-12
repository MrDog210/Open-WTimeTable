import { useEffect, useState } from "react"
import { View, Text } from "react-native"
import { fetchGroupsForBranch, fetchNotifications, fetchTimetable } from "../../util/http"
import StyledButton from "../../components/ui/StyledButton"
import { getToken } from "../../util/token"
import { getServerUrl } from "../../store/schoolInfo"

function GroupSelectScreen({route}) {
  const { schoolInfo, chosenProgramm, chosenYear, branchId } = route.params
  const [isFetchingData, setIsFetchingData] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsFetchingData(true)
        //await fetchGroupsForBranch(schoolInfo.schoolCode, branchId)
        //await fetchNotifications()
        await fetchTimetable()
      } catch (error) {
        Alert.alert('An error ocurred', error.message)
      }
    }
    setIsFetchingData(false)
    fetchData()
  }, [])

  async function sraje() {
    console.log(await getToken())
    console.log(await getServerUrl())
  }

  return (
    <View>
      <Text>Select your groups</Text>
      <StyledButton title='test' onPress={sraje} />
    </View>
  )
}

export default GroupSelectScreen