import { StyleSheet, View } from "react-native"
import Text from "../ui/Text"
import TextInput from "../ui/TextInput"
import { useState } from "react"
import Button from "../ui/Button"

type EditUsersNoteProps = {
  note: string,
  onCancelPressed: () => void,
  onConfirmPressed: (note: string) => void
}

function EditUsersNote({note, onCancelPressed, onConfirmPressed}: EditUsersNoteProps) {
  const [uNote, setUNote] = useState(note)

  return(
    <View style={{flex: 1}}>
      <Text>Edit note:</Text>
      <TextInput value={uNote} onChangeText={setUNote} />
      <View style={styles.buttonContainer}>
        <Button containerStyle={styles.button} onPress={onCancelPressed}>Cancel</Button>
        <Button containerStyle={styles.button} onPress={() => onConfirmPressed(uNote)}>Confirm</Button>
      </View>
    </View>
  )
}

export default EditUsersNote

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row'
  },
  button: {
    flex: 1
  }
})