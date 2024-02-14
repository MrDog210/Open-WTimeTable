import { View } from "react-native"
import Title from "../ui/Title"
import { useImperativeHandle, useState } from "react"
import DropDownPicker from "react-native-dropdown-picker"

function CourseGroupSelect({course, groups, _ref}) {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false)
  const [chosenGroupsID, setChosenGroupsID] = useState([])

  useImperativeHandle(_ref, () => {
    getChosenGroupIDs: () => chosenGroupsID
  })
  return (
  <View>
    <Title>{course.course}:</Title>
    <DropDownPicker items={groups}
          open={isDropDownOpen}
          setOpen={setIsDropDownOpen}
          value={chosenGroupsID}
          setValue={setChosenGroupsID}
          schema={{
            label: 'name',
            value: 'id'
          }}
          placeholder='Select groups'
          multiple={true}
          min={0}
          max={groups.length}
          listMode='MODAL'
        />
  </View>)
}

export default CourseGroupSelect