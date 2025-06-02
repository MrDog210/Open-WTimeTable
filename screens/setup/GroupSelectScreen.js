import { useContext, useEffect, useState } from "react"
import { View, Alert, FlatList, StyleSheet } from "react-native"
import { getAllCourses, getAllDistinctGroupsOfCourse, insertSelectedGroups, querryNumOFSelectedGroups, truncateSelectedGroups } from "../../util/database"
import CourseGroupSelect from "../../components/groupSelect/CourseGroupSelect"
import StyledButton from "../../components/ui/StyledButton"
import Spinner from "react-native-loading-spinner-overlay"
import Title from "../../components/ui/Title"
import { SPINNER_STYLE } from "../../constants/globalStyles"
import { UserPreferencesContext } from "../../store/userPreferencesContext"
import Line from "../../components/ui/Line"
import { getAllStoredBranchGroups } from "../../store/schoolInfo"
import { getGroupsIntersection } from "../../util/groupUtil"

function GroupSelectScreen({route, navigation}) {
  const [isFetchingData, setIsFetchingData] = useState(false)
  const [fetchingDataMessage, setFetchingDataMessage] = useState('')
  const [coursesAndTheirGroups, setCoursesAndTheirGroups] = useState([])
  const userPreferencesCtx = useContext(UserPreferencesContext)

  const { isEditing } = route.params

  useEffect(() => {
    async function fetchData() {
      try {
        setIsFetchingData(true)
        setFetchingDataMessage('Querying data')
        setCoursesAndTheirGroups([])
        const branchGroups = await getAllStoredBranchGroups() // it is used to filter out unwanted groups
        const allCourses = await getAllCourses()
        console.log('All courses: ' + JSON.stringify(allCourses, null, '\t'))
        for (const course of allCourses) { // if in editing mode, we find set all the preselected groups
          let courseGroups = await getAllDistinctGroupsOfCourse(course.id)
          courseGroups = getGroupsIntersection(courseGroups, branchGroups) // we keep only the relevant groups
          for(const group of courseGroups) {
            const data = await querryNumOFSelectedGroups(course.id, group.id)
            group.selected = data.num >= 1
          }
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
            await insertSelectedGroups(courseId, group.id)
        })
      })
      if (isEditing) {
        navigation.goBack()
      } else {
        const pref = userPreferencesCtx.preferences // should find better way of doing this
        console.log(pref)
        pref.hasCompletedSetup = true
        userPreferencesCtx.setPreferences(pref)
      }
    } catch (error) {
      Alert.alert('An error occured', error.message)
    }
    setIsFetchingData(false)
  }

  function onCancelPressed() {
    navigation.goBack()
  }

  return (
    <View style={styles.container}>
      <Spinner visible={isFetchingData} textContent={fetchingDataMessage} 
      {...SPINNER_STYLE}
      />
      <View style={styles.groupSelectContainer}>
        <Title>Select your groups</Title>
        <Line />
        <FlatList data={coursesAndTheirGroups} keyExtractor={item => item.course.id} 
          renderItem={({item}) => <CourseGroupSelect groups={item.groups} course={item.course} />} 
        />
      </View>
      <View style={styles.buttonContainer}>
        {isEditing && <StyledButton containerStyle={styles.button} title='Cancel' onPress={onCancelPressed} isWarning/>}
        <StyledButton containerStyle={styles.button} title='Finish' onPress={onFinishedPressed} />
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
    flex: 1,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    flex: 1
  }
})