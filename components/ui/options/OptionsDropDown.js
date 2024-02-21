import DropDownPicker from "react-native-dropdown-picker"
import { COLORS } from "../../../constants/colors"
import { StyleSheet } from "react-native"
import { useState } from "react"
import { OPTIONS_CONTAINER_STYLE, OPTIONS_TEXT_STYLE } from "../../../constants/globalStyles"

function OptionsDropdown(props) {
  const [open, setOpen] = useState(false)
  return (
    <DropDownPicker {...props} open={open} setOpen={setOpen} listMode='MODAL'
      style={[OPTIONS_CONTAINER_STYLE, styles.main]} 
      textStyle={OPTIONS_TEXT_STYLE}
      containerStyle={styles.containerStyle}
    />
  )
}

export default OptionsDropdown

const styles = StyleSheet.create({
  main: {

  },
  text: {
    
  },
  containerStyle: {
    backgroundColor: COLORS.background.secondary
  }
})