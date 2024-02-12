import { useEffect, useState } from "react"
import { View, Text } from "react-native"
import { fetchGroupsForBranch, fetchNotifications, fetchTimetable } from "../../util/http"

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

  return (
    <View>
      <Text>Select your groups</Text>
    </View>
  )
}

export default GroupSelectScreen