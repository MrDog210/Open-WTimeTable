import { useContext, useEffect, useState } from "react"
import { View, Alert, FlatList, StyleSheet } from "react-native"
import { getAllCourses, getAllDistinctGroupsOfCourse, insertSelectedGroups, truncateSelectedGroups } from "../../util/database"
import CourseGroupSelect from "../../components/groupSelect/CourseGroupSelect"
import StyledButton from "../../components/ui/StyledButton"
import Spinner from "react-native-loading-spinner-overlay"
import Title from "../../components/ui/Title"
import { COLORS } from "../../constants/colors"
import { SPINNER_STYLE } from "../../constants/globalStyles"
import { UserPreferencesContext } from "../../store/userPreferencesContext"
import { getAllStoredBranchGroups } from "../../store/schoolInfo"
import { getGroupsIntersection } from "../../util/groupUtil"

function GroupSelectScreen({route, navigation}) {
  const [isFetchingData, setIsFetchingData] = useState(false)
  const [fetchingDataMessage, setFetchingDataMessage] = useState('')
  const [coursesAndTheirGroups, setCoursesAndTheirGroups] = useState([])
  const userPreferencesCtx = useContext(UserPreferencesContext)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsFetchingData(true)
        setFetchingDataMessage('Querying data')
        setCoursesAndTheirGroups([])
        //const branchGroups = await getAllStoredBranchGroups()
        const allCourses = await getAllCourses()
        console.log('All courses: ' + JSON.stringify(allCourses, null, '\t'))
        for (const course of allCourses) {
          let courseGroups = await getAllDistinctGroupsOfCourse(course.id)
          //courseGroups = getGroupsIntersection(courseGroups, branchGroups)
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

  async function onFinishedPressed() {
    try {
      setIsFetchingData(true)
      setFetchingDataMessage('Inserting data into db')

      await truncateSelectedGroups()
      coursesAndTheirGroups.forEach(async courseAndGroup => {
        const {course, groups} = courseAndGroup
        const courseId = course.id
        groups.forEach(async group => {
          if(group.selected)
            insertSelectedGroups(courseId, group.id)
        })
      })
      const pref = userPreferencesCtx.preferences // should find better way of doing this
      console.log(pref)
      pref.hasCompletedSetup = true
      userPreferencesCtx.setPreferences(pref)
    } catch (error) {
      Alert.alert('An error occured', error.message)
    }
    setIsFetchingData(false)
  }

  return (
    <View style={styles.container}>
      <Spinner visible={isFetchingData} textContent={fetchingDataMessage} 
      {...SPINNER_STYLE}
      />
      <View style={styles.groupSelectContainer}>
        <Title>Select your groups</Title>
        <FlatList data={coursesAndTheirGroups} keyExtractor={item => item.course.id} 
          renderItem={({item}) => <CourseGroupSelect groups={item.groups} course={item.course} />} 
        />
      </View>
      <View>
        <StyledButton title='Finish' onPress={onFinishedPressed} />
      </View>
    </View>
  )
}

export default GroupSelectScreen

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  groupSelectContainer: {
    flex: 1
  }
})