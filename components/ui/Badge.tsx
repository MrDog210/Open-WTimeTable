import { View } from "react-native"
import Text from "./Text"
import { useTheme } from "../../context/ThemeContext"


type BadgeProps = {
  children: string
}

function Badge({children}: BadgeProps) {
  const {colors} = useTheme()

  return (
    <View style={{
        justifyContent: 'center',
        alignItems: 'center',
    }}><View style={{
      backgroundColor: colors.primaryBackground,
      paddingVertical: 2,
      paddingHorizontal: 8,
      borderRadius: 10,
      borderWidth: 1.4,
      borderColor: colors.primary
    }}>
      <Text style={{
        fontSize: 14,
        color: colors.primary,
        fontWeight: '800'
      }}>{children}</Text>
    </View></View>
  )
}

export default Badge