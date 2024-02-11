import { useLayoutEffect } from "react"
import { Text, View } from "react-native"

function SelectGroupsScreen({route, navigation}) {
  const { schoolInfo } = route.params

  useLayoutEffect(() => {
    navigation.setOptions({
      title: schoolInfo.schoolName
    })
  }, [])
  return (
    <View>
      <Text>Welcome to group select</Text>
    </View>
  )
}

export default SelectGroupsScreen