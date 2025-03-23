import { useEffect, useState } from "react"
import { Modal, StyleSheet, View } from "react-native"
import { getCustomLectures } from "../../store/customLectures"
import Spinner from "react-native-loading-spinner-overlay"
import { SPINNER_STYLE } from "../../constants/globalStyles"
import StyledButton from "../../components/ui/StyledButton"
import IconButton from "../../components/ui/IconButton"
import EditCustomLectureModal from "../../components/ui/EditCustomLectureModal"

function EditCustomCoursesScreen() {
  const [customCourses, setCustomCourses] = useState(undefined)
  const [visibleModal, setModalVisible] = useState(false)

  useEffect(() => {
    async function loadCustomCourses() {
      setCustomCourses(await getCustomLectures())
    }
    loadCustomCourses()
  }, [])

  function onAddNewCourse(course) {

  }

  if(!customCourses)
    return <Spinner visible={true} {...SPINNER_STYLE} />

  return (
    <>
      <Modal visible={visibleModal} onRequestClose={() => setModalVisible(false)}>
        <EditCustomLectureModal  />
      </Modal>
      <View style={{flex: 1}}> 
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