import { View } from "react-native"
import Title from "../ui/Title"
import { useState } from "react"
import DropDownPicker from "react-native-dropdown-picker"

function CourseGroupSelect({course, groups}) {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false)
  const [chosenGroupsID, setChosenGroupsID] = useState([])

  function onGroupSelected(groupsIds) {
    groups.forEach(group => {
      group.selected = false
    });

    groupsIds.forEach(groupId => {
      let group = groups.find(g => g.id === groupId)
      group.selected = true
    })
  }

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
          onChangeValue={onGroupSelected}
        />
  </View>)
}

export default CourseGroupSelect