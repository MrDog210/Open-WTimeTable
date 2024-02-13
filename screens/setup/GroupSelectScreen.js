import { useEffect, useState } from "react"
import { View, Text } from "react-native"
import { fetchGroupsForBranch, fetchLecturesForGroups, fetchNotifications, fetchTimetable } from "../../util/http"
import StyledButton from "../../components/ui/StyledButton"
import { getToken } from "../../util/token"
import { getServerUrl } from "../../store/schoolInfo"
import { getAllUniqueGroups } from "../../util/groupUtil"
import { getAllDistinctGroupsOfCourse, getAllGroups, getAllLectures } from "../../util/database"

function GroupSelectScreen({route}) {
  const { schoolInfo, chosenProgramm, chosenYear, branchId } = route.params
  const [isFetchingData, setIsFetchingData] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsFetchingData(true)
        //await fetchGroupsForBranch(schoolInfo.schoolCode, branchId)
        //await fetchNotifications()
        //await fetchTimetable()
      } catch (error) {
        Alert.alert('An error ocurred', error.message)
      }
    }
    setIsFetchingData(false)
    fetchData()
  }, [])

  async function sraje() {
    /* console.log(await getToken())
    console.log(await getServerUrl()) */
    //const groups = getAllUniqueGroups(await fetchGroupsForBranch(schoolInfo.schoolCode, branchId))
    //fetchLecturesForGroups(schoolInfo.schoolCode, groups)
    //getAllGroups()
    //getAllLectures()
    //console.log(groups)
    getAllDistinctGroupsOfCourse(540)
  }

  return (
    <View>
      <Text>Select your groups</Text>
      <StyledButton title='test' onPress={sraje} />
    </View>
  )
}

export default GroupSelectScreen