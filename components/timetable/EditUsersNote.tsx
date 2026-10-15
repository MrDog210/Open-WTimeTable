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
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={{fontWeight: 'bold'}}>Edit note:</Text>
        <TextInput
          value={uNote}
          onChangeText={setUNote}
          autoFocus
          returnKeyType="done"
          onSubmitEditing={() => onConfirmPressed(uNote)}
        />
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
  container: {
    width: '100%',
  },
  contentContainer: {
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
    flex: 1,
    minHeight: 50
  }
})