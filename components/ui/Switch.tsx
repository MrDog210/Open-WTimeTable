import { Switch as SwitchRNG } from "react-native-gesture-handler"
import { useTheme } from "../../context/ThemeContext"
import { SwitchProps } from "react-native"

function Switch(props: SwitchProps) {
  const {colors} = useTheme()

  return (
    <SwitchRNG
      trackColor={{
        false: colors.surfaceVariant,
        true: colors.secondary
      }} 
      thumbColor={colors.primary}
      {...props}
      />
  )
}

export default Switch