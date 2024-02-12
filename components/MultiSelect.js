import { FlatList, View } from "react-native"
import StyledButton from "./ui/StyledButton"
import { useState } from "react"

function renderData({item, index}) {

}

function MultiSelect({data, keyExtractor}) {
  const [selectedItems, setSelectedItems] = useState([])

  function onConfirm() {
    
  }

  return (
    <View>
      <View>
        <FlatList data={data} keyExtractor={keyExtractor} renderItem={renderData}/>
      </View>
      <View>
        <StyledButton title='Confirm'/>
      </View>
    </View>
  )
}

export default MultiSelect