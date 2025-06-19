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
      <View style={styles.contentContainer}>
        <Text style={{fontWeight: 'bold'}}>Edit note:</Text>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <TextInput value={uNote} onChangeText={setUNote} />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button mode='SECONDARY' containerStyle={styles.button} onPress={onCancelPressed}>Cancel</Button>
        <Button containerStyle={styles.button} onPress={() => onConfirmPressed(uNote)}>Confirm</Button>
      </View>
    </View>
  )
}

export default EditUsersNote

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 10,
    gap: 10
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 5,
    padding: 5,
    paddingTop: 0
  },
  button: {
    flex: 1
  }
})