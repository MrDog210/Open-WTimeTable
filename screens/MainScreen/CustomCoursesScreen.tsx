import { useState } from "react"
import Container from "../../components/ui/Container"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { CustomLecture } from "../../types/types"
import { getCustomLectures, setCustomLectures } from "../../util/store/customLectures"
import { Alert, FlatList, View, StyleSheet, Modal } from "react-native"
import LoadingOverlay from "../../components/ui/LoadingOverlay"
import IconButton from "../../components/ui/IconButton"
import CustomCourseRow from "../../components/customCourses/CustomCourseRow"
import EditCustomLectureModal from "../../components/customCourses/EditCustomLectureModal"
import { invalidateLecturesQueries } from "../../util/http/reactQuery"

const QUERY_CUSTOM_COURSES = 'customCourses'

function CustomCoursesScreen() {
  const [visibleModal, setModalVisible] = useState(false)
  const [editingCourse, setEditingCourse] = useState(-1)
  
  const queryClient = useQueryClient()
  const {data: customCourses} = useQuery<CustomLecture[]>({
    queryKey: [QUERY_CUSTOM_COURSES],
    queryFn: getCustomLectures,
    initialData: [],
    networkMode: 'always'
  })
  
  // TODO: add swiping to delete

  function onAddOrEditCourse(course: CustomLecture) {
    console.log(course)
    setModalVisible(false)
    const newData = editingCourse === -1 ? [...customCourses, course] : customCourses.map((c, index) => index === editingCourse ? course : c)
    setCustomLectures(newData)
    queryClient.setQueryData([QUERY_CUSTOM_COURSES], newData)
    setEditingCourse(-1)
    invalidateLecturesQueries(queryClient)
  }

  function deleteCoures(index: number) {
    const newData = customCourses.filter((_, i) => i !== index)
    setCustomLectures(newData)
    queryClient.setQueryData([QUERY_CUSTOM_COURSES], newData)
    invalidateLecturesQueries(queryClient)
  }

  function onCollumnPressed(index: number) {
    setEditingCourse(index)
    setModalVisible(true)
  }

  function onCollumnLongPressed(index: number) {
    Alert.alert('Delete course', `Are you sure you want to delete: ${customCourses[index].course}?`, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK', 
        onPress: () => deleteCoures(index)
      },
    ]);
  }

  if(!customCourses)
    return <LoadingOverlay visible={true} />
    
  return (
    <Container>
      <Modal animationType="slide" visible={visibleModal} onRequestClose={() => {setModalVisible(false); setEditingCourse(-1)}}>
        <EditCustomLectureModal
          onCancelPressed={() => {setModalVisible(false); setEditingCourse(-1)}} 
          onConfirmPressed={onAddOrEditCourse}
          customCourse={editingCourse !== -1 ? customCourses[editingCourse] : undefined}
        />
      </Modal>
      <FlatList 
        data={customCourses} 
        renderItem={({item, index}) => <CustomCourseRow key={item.id} onSwipeDelete={() => deleteCoures(index)} customCourse={item} onPress={() => onCollumnPressed(index)} onLongPress={() => onCollumnLongPressed(index)}/>}  />
      <View style={styles.addButtonContainer}>
        <IconButton name='add-outline' style={styles.addButton} onPress={() => setModalVisible(true)}/>
      </View>
    </Container>
  )
}

export default CustomCoursesScreen

const styles = StyleSheet.create({
  addButtonContainer: {
    position: 'absolute',
    borderRadius: 100,
    bottom: 16,
    right: 16,
    overflow: 'hidden'
  },
  addButton: {
    padding: 14
  }
})