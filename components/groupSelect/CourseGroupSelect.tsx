import { useEffect, useState } from "react"
import DropDownPicker from "../ui/DropDownPicker"
import { Course, GroupWithSelected } from "../../types/types"
import Text from "../ui/Text"

type CourseGroupSelectProps = {
  course: Course,
  groups: GroupWithSelected[]
}

function CourseGroupSelect({course, groups}: CourseGroupSelectProps) {
  const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false)
  const [chosenGroupsID, setChosenGroupsID] = useState<number[]>([])

  useEffect(() => {
    groups.forEach(group => {
      if(group.selected)
        setChosenGroupsID(values => [...values, group.id])
    })
  }, [])

  function onGroupSelected(groupsIds: number[]) {
    groups.forEach(group => {
      group.selected = false
    });

    groupsIds.forEach(groupId => {
      let group = groups.find(g => g.id === groupId)
      group!.selected = true
    })
  }

  return (
    <>
      <Text>{course.course}</Text>
      <DropDownPicker 
        items={groups as any}
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
        onChangeValue={onGroupSelected}
        mode='BADGE'
      />
    </>
  )
}

export default CourseGroupSelect