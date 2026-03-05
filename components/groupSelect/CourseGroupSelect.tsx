import { useEffect, useState } from "react"
import { Course, GroupWithSelected } from "../../types/types"
import Text from "../ui/Text"
import NewDropDownPicker from "../ui/NewDropDownPicker"

type CourseGroupSelectProps = {
  course: Course,
  groups: GroupWithSelected[]
}

function CourseGroupSelect({course, groups}: CourseGroupSelectProps) {
  const [chosenGroupsID, setChosenGroupsID] = useState<number[]>([])

  useEffect(() => {
    const selectedGroupIds = groups
      .filter(group => group.selected)
      .map(group => group.id)
    setChosenGroupsID(selectedGroupIds)
  }, [groups])

  function onGroupSelected(groupsIds: number[] | null) {
    const safeGroupIds = groupsIds ?? []
    groups.forEach(group => {
      group.selected = false
    });

    safeGroupIds.forEach(groupId => {
      const group = groups.find(g => g.id === groupId)
      group!.selected = true
    })
  }

  return (
    <>
      <Text style={{ paddingBottom: 2}}>{course.course}</Text>
      <NewDropDownPicker 
        items={groups as any}
        value={chosenGroupsID as any}
        setValue={setChosenGroupsID as any}
        schema={{
          label: 'name',
          value: 'id'
        }}
        placeholder='Select groups'
        title={course.course}
        multiple
        onChangeValue={onGroupSelected as any}
      />
    </>
  )
}

export default CourseGroupSelect