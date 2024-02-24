import { View } from "react-native";
import { COLORS } from "../../constants/colors";

function Line({style}) {
  return <View style={[{
      width: '100%', 
      borderBottomWidth: 1, 
      borderBottomColor: COLORS.background.seperator,
      marginVertical: 10
    }, style]}></View>
}

export default Line