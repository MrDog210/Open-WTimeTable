import { View } from "react-native";
import Text from "./Text";
import Button from "./Button";
import TextInput from "./TextInput";

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