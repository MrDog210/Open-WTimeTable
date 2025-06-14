import { View } from "react-native";
import TextInput from "./TextInput";
import { Button, Text } from "react-native-paper";

function ComponentsShowcase() {

  return (
    <View style={{gap: 10, flex: 1}}>
      <Text>Text</Text>
      <Button>test</Button>
      <TextInput />
    </View>
  )
}

export default ComponentsShowcase