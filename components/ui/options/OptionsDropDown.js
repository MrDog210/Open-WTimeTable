import { COLORS } from "../../../constants/colors"
import { useState } from "react"
import DropDownWithTitle from "../DropDownWithTitle"

function OptionsDropdown(props) {
  const [open, setOpen] = useState(false)
  return (
    <DropDownWithTitle {...props} open={open} setOpen={setOpen} listMode='MODAL'
      style={{borderRadius: 0, borderWidth: 0, borderBottomWidth: 1, borderColor: COLORS.foreground.secondary, backgroundColor: COLORS.background.primary}} 
    />
  )
}

export default OptionsDropdown