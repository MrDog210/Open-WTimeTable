import { useEffect, useState } from "react"
import { Modal, StyleSheet, View, Alert } from "react-native"
import { getCustomLectures, setCustomLectures } from "../../store/customLectures"
import Spinner from "react-native-loading-spinner-overlay"
import { SPINNER_STYLE } from "../../constants/globalStyles"
import StyledButton from "../../components/ui/StyledButton"
import IconButton from "../../components/ui/IconButton"
import EditCustomLectureModal from "../../components/ui/EditCustomLectureModal"
import { FlatList } from "react-native-gesture-handler"
import CustomCourseRow from "../../components/customCourses/CustomCourseRow"

function EditCustomCoursesScreen() {
  const [customCourses, setCustomCourses] = useState(undefined)
  const [visibleModal, setModalVisible] = useState(false)
  const [editingCourse, setEditingCourse] = useState(-1)

  useEffect(() => {
    async function loadCustomCourses() {
      setCustomCourses(await getCustomLectures())
    }
    loadCustomCourses()
  }, [])

  function onAddOrEditCourse(course) {
    console.log(course)
    setModalVisible(false)
    const newData = editingCourse === -1 ? [...customCourses, course] : customCourses.map((c, index) => index === editingCourse ? course : c)
    setCustomCourses(newData)
    setCustomLectures(newData)
    setEditingCourse(-1)
  }

  function deleteCoures(index) {
    const newData = customCourses.filter((_, i) => i !== index)
    setCustomCourses(newData)
    setCustomLectures(newData)
  }

  function onCollumnPressed(index) {
    setEditingCourse(index)
    setModalVisible(true)
  }

  useEffect(() => {
    console.log(editingCourse)
  }, [editingCourse])

  function onCollumnLongPressed(index) {
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
    return <Spinner visible={true} {...SPINNER_STYLE} />

  return (
    <>
      <Modal animationType="slide" visible={visibleModal} onRequestClose={() => {setModalVisible(false); setEditingCourse(-1)}}>
        <EditCustomLectureModal
          onCancelPressed={() => {setModalVisible(false); setEditingCourse(-1)}} 
          onConfirmPressed={onAddOrEditCourse}
          customCourse={editingCourse !== -1 ? customCourses[editingCourse] : undefined}
        />
      </Modal>
      <View style={{flex: 1}}> 
        <FlatList 
          data={customCourses} 
          renderItem={({item, index}) => <CustomCourseRow customCourse={item} onPress={() => onCollumnPressed(index)} onLongPress={() => onCollumnLongPressed(index)}/>} 
          keyExtractor={(i) => i.id} />
        <View style={styles.addButtonContainer}>
          <IconButton name='add-outline' style={styles.addButton} onPress={() => setModalVisible(true)}/>
        </View>
      </View>
    </>
  )
}

export default EditCustomCoursesScreen

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