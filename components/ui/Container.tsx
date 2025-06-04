import { type ReactNode } from "react"
import {type StyleProp, type ViewStyle } from "react-native"
import { useTheme } from "../../context/ThemeContext"
import { SafeAreaView } from 'react-native-safe-area-context'

type ContainerProps = {
  style?: StyleProp<ViewStyle>,
  children?: ReactNode
}

function Container({children, style}: ContainerProps) {
  const {colors} = useTheme()
  return (
    <SafeAreaView style={[{flex: 1, backgroundColor: colors.background}, style]}>
      {children}
    </SafeAreaView>
  )
}

export default Container