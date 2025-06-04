import { type StyleProp, type TextInputProps, View, type ViewStyle } from "react-native";
import { useTheme } from "../../context/ThemeContext";

interface DividerProps extends TextInputProps {
  style?: StyleProp<ViewStyle>,
}

function Divider({style}: DividerProps) {
  const {colors} = useTheme()

  return <View style={[{
      width: '100%',
      borderBottomWidth: 1,
      borderBottomColor: colors.onBackground
    }, style]}></View>
}

export default Divider