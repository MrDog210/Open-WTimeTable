import { useRef, useState } from "react";
import Dialog from "react-native-dialog";
import StyledButton from "./StyledButton";

function InputDialogue({onRequestConfirm, title, label, toggleVisibility, buttonContainerStyle, input}) {
  const [isVisible, setIsVisible] = useState()
  const [inputContents, setInputContents] = useState(input)

  function toggleVisibility() {
    setIsVisible(!isVisible)
  }

  function confirm() {
    toggleVisibility()
    onRequestConfirm(inputContents)
  }

  return (
    <>
      <StyledButton containerStyle={buttonContainerStyle} title={title} onPress={toggleVisibility}/>
      <Dialog.Container visible={isVisible} onRequestClose={toggleVisibility}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Input label={label} value={inputContents} onChangeText={setInputContents}/>
        <Dialog.Button label="Cancel" onPress={toggleVisibility}/>
        <Dialog.Button label="Confirm" onPress={confirm} />
      </Dialog.Container>
    </>
  )
}

export default InputDialogue