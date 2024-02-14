import { useEffect, useState } from "react"
import { View, Text, Alert, FlatList } from "react-native"
import { fetchGroupsForBranch, fetchLecturesForGroups, fetchNotifications, fetchTimetable } from "../../util/http"
import StyledButton from "../../components/ui/StyledButton"
import { getToken } from "../../util/token"
import { getServerUrl } from "../../store/schoolInfo"
import { getAllUniqueGroups } from "../../util/groupUtil"
import { getAllCourses, getAllDistinctGroupsOfCourse, getAllGroups, getAllLectures } from "../../util/database"
import CourseGroupSelect from "../../components/groupSelect/CourseGroupSelect"

function GroupSelectScreen({route}) {
  const { schoolInfo, chosenProgramm, chosenYear, branchId } = route.params
  const [isFetchingData, setIsFetchingData] = useState(false)
  const [coursesAndTheirGroups, setCoursesAndTheirGroups] = useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        setIsFetchingData(true)
        setCoursesAndTheirGroups([])
        const allCourses = await getAllCourses()
        console.log('All courses: ' + JSON.stringify(allCourses, null, '\t'))
        for (const course of allCourses) {
          //console.log('Course: ' + course)
          const courseGroups = await getAllDistinctGroupsOfCourse(course.id)
          console.log('Course groups: ' + JSON.stringify(courseGroups, null, '\t'));
          //console.log('Course groups: ' + courseGroups)
          setCoursesAndTheirGroups(current => [...current, {course: course, groups: courseGroups}])
          //console.log(JSON.stringify(coursesAndTheirGroups, null, '\t'));
        }
        /* console.log('END RESULT')
        console.log(coursesAndTheirGroups)
        console.log(JSON.stringify(coursesAndTheirGroups, null, '\t')); */
        //await fetchGroupsForBranch(schoolInfo.schoolCode, branchId)
        //await fetchNotifications()
        //await fetchTimetable()
      } catch (error) {
        Alert.alert('An error ocurred', error.message)
      }
      setIsFetchingData(false)
    }
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
  }

  return (
    <View>
      <Text>Select your group</Text>
      <StyledButton title='test' onPress={sraje} />
      <FlatList data={coursesAndTheirGroups} keyExtractor={item => item.course.id} 
      renderItem={({item}) => <CourseGroupSelect groups={item.groups} course={item.course} />} />
    </View>
  )
}

export default GroupSelectScreen