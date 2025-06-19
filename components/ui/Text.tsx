import { Text as TextRN, type TextProps } from "react-native"
import { useTheme } from "../../context/ThemeContext"

function Text({style, ...props}: TextProps) {
  const {colors} = useTheme()
  return (
    <TextRN style={[{fontSize: 16, color: colors.onBackground}, style]} {...props} />
  )
}

export default Text