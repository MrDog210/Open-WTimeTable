import { useState } from "react"
import { useSettings } from "../../context/UserSettingsContext"
import { FlatList, View, StyleSheet } from "react-native"
import Button from "../../components/ui/Button"
import { getAllStoredBranchGroups } from "../../util/store/schoolData"
import { getAllCourses, getAllDistinctGroupsOfCourse, insertSelectedGroup, querryNumOFSelectedGroups, truncateSelectedGroups } from "../../util/store/database"
import { getGroupsIntersection } from "../../util/timetableUtils"
import { StaticScreenProps, useNavigation } from "@react-navigation/native"
import { Course, GroupWithSelected } from "../../types/types"
import LoadingOverlay from "../../components/ui/LoadingOverlay"
import CourseGroupSelect from "../../components/groupSelect/CourseGroupSelect"
import Container from "../../components/ui/Container"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { invalidateLecturesQueries, QUERY_COURSES_AND_GROUPS } from "../../util/http/reactQuery"

type ProgramSelectScreenProps = StaticScreenProps<{
  isEditing?: boolean
}>;

type CoursesAndTheirGroups = {
  course: Course,
  groups: GroupWithSelected[]
}

function GroupSelectScreen({route}: ProgramSelectScreenProps) {
  const [isFetchingData, setIsFetchingData] = useState<boolean>(false)
  const [fetchingDataMessage, setFetchingDataMessage] = useState<string>('Querying data')
  const { changeSettings } = useSettings()
  const navigation = useNavigation()
  const { isEditing = false } = route.params
  const queryClient = useQueryClient()

  const { data: coursesAndTheirGroups} = useQuery<CoursesAndTheirGroups[]>({
    initialData: [],
    queryFn: async () => {
      const branchGroups = await getAllStoredBranchGroups() // it is used to filter out unwanted groups
      const allCourses = await getAllCourses()
      console.log('All courses: ' + JSON.stringify(allCourses, null, '\t'))
      const final: CoursesAndTheirGroups[] = []
      for (const course of allCourses) { // if in editing mode, we find set all the preselected groups
        let courseGroups = await getAllDistinctGroupsOfCourse(course.id)
        courseGroups = getGroupsIntersection(courseGroups, branchGroups) // we keep only the relevant groups
        const courseGroupsSelected: GroupWithSelected[] = []
        for(const group of courseGroups) {
          const data = await querryNumOFSelectedGroups(course.id, group.id)
          courseGroupsSelected.push({
            ...group,
            selected: data!.num >= 1
          })
        }
        console.log('Course groups: ' + JSON.stringify(courseGroups, null, '\t'));
        final.push({course: course, groups: courseGroupsSelected})
      }
      return final
    },
    queryKey: [QUERY_COURSES_AND_GROUPS],
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    networkMode: 'always'
  })

  const insertSelectedGroups = useMutation({
    mutationFn: async () => {
      setFetchingDataMessage('Inserting data into db')
      await truncateSelectedGroups()
      coursesAndTheirGroups.forEach(async courseAndGroup => {
        const {course, groups} = courseAndGroup
        const courseId = course.id
        groups.forEach(async group => {
          if(group.selected)
            await insertSelectedGroup(courseId, group.id)
        })
      })
      if(!isEditing)
        await changeSettings({
          hasCompletedSetup: true
        })
      else
        invalidateLecturesQueries(queryClient)
    },
    networkMode: 'always'
  })

  async function onFinishedPressed() {
    try {
      await insertSelectedGroups.mutateAsync()
      if (isEditing)
        navigation.goBack()
    } catch (error) {
      if(error instanceof Error) {
        //Alert.alert('An error occured', error.message)
        console.error(error)
      }
    }
  }

  function onCancelPressed() {
    navigation.goBack()
  }

  return (
    <Container style={styles.container}>
      <LoadingOverlay visible={isFetchingData} text={fetchingDataMessage} />
      <View style={styles.groupSelectContainer}>
        <FlatList data={coursesAndTheirGroups}
          renderItem={({item}) => <CourseGroupSelect key={item.course.id} groups={item.groups} course={item.course} />} 
        />
      </View>
      <View style={styles.buttonContainer}>
        {isEditing && <Button containerStyle={styles.button} onPress={onCancelPressed} mode="WARNING">Cancel</Button>}
        <Button containerStyle={styles.button} onPress={onFinishedPressed}>Finish</Button>
      </View>
    </Container>
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