import { View } from "react-native";
import { COLORS } from "../../constants/colors";

function Line() {
  return <View style={{
      width: '100%', 
      borderBottomWidth: 1, 
      borderBottomColor: COLORS.background.seperator,
      marginVertical: 10
    }}></View>
}

export default Line