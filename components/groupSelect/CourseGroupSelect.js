import { useEffect, useState } from "react"
import DropDownWithTitle from "../ui/DropDownWithTitle"

function CourseGroupSelect({course, groups}) {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false)
  const [chosenGroupsID, setChosenGroupsID] = useState([])

  useEffect(() => {
    groups.forEach(group => {
      if(group.selected)
        setChosenGroupsID(values => [...values, group.id])
    })
  }, [])

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
    <DropDownWithTitle 
      items={groups}
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
      title={course.course}
      mode='BADGE'
    />
  )
}

export default CourseGroupSelect