import { useEffect, useState } from "react"
import { ScrollView } from "react-native-gesture-handler"
import { getCustomLectures } from "../../store/customLectures"
import Spinner from "react-native-loading-spinner-overlay"
import { SPINNER_STYLE } from "../../constants/globalStyles"

function EditCustomCoursesScreen() {
  const [customCourses, setCustomCourses] = useState(undefined)

  useEffect(() => {
    async function loadCustomCourses() {
      setCustomCourses(await getCustomLectures())
    }
    //loadCustomCourses()
  }, [])

  if(!customCourses)
    return <Spinner visible={true} {...SPINNER_STYLE} />

  return (
    <>
    </>
  )
}

export default EditCustomCoursesScreen