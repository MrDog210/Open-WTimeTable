import { type ReactNode } from "react"
import { View, type StyleProp, type ViewStyle } from "react-native"
import { useTheme } from "../../context/ThemeContext"
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type ContainerProps = {
  style?: StyleProp<ViewStyle>,
  children?: ReactNode,
  isHeaderShown?: boolean
}

function Container({children, style, isHeaderShown = true}: ContainerProps) {
  const {colors} = useTheme()
   const insets = useSafeAreaInsets();
  return (
    <View style={[{flex: 1, backgroundColor: colors.background, 
        marginTop: isHeaderShown ? 0 : insets.top,
        marginBottom: insets.bottom,
        marginLeft: insets.left,
        marginRight: insets.right,}, style]}>
      {children}
    </View>
  )
}

export default Container