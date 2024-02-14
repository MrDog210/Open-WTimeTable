import { useEffect, useState } from "react"
import { View, Text, Alert, FlatList } from "react-native"
import { getAllCourses, getAllDistinctGroupsOfCourse, getAllGroups, getAllLectures } from "../../util/database"
import CourseGroupSelect from "../../components/groupSelect/CourseGroupSelect"
import StyledButton from "../../components/ui/StyledButton"
import Spinner from "react-native-loading-spinner-overlay"

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
          const courseGroups = await getAllDistinctGroupsOfCourse(course.id)
          courseGroups.forEach(group => {
            group.selected = false
          })
          console.log('Course groups: ' + JSON.stringify(courseGroups, null, '\t'));
          setCoursesAndTheirGroups(current => [...current, {course: course, groups: courseGroups}])
        }
      } catch (error) {
        Alert.alert('An error ocurred', error.message)
      }
      setIsFetchingData(false)
    }
    fetchData()
  }, [])

  function onFinishedPressed() {
    console.log(JSON.stringify(coursesAndTheirGroups, null, '\t'));
  }

  return (
    <View>
      <Spinner visible={isFetchingData} />
      <Text>Select your group</Text>
      <FlatList data={coursesAndTheirGroups} keyExtractor={item => item.course.id} 
      renderItem={({item}) => <CourseGroupSelect groups={item.groups} course={item.course} />} />
      <StyledButton title='Finished' onPress={onFinishedPressed} />
    </View>
  )
}

export default GroupSelectScreen