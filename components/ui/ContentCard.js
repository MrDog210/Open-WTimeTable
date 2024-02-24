import { StyleSheet, View } from "react-native"
import StyledText from "./StyledText"

function ContentCard({title, contents}){
  if(contents === null || contents === '')
    return
  return (
    <View>
      <StyledText style={styles.title}>{title}</StyledText>
      <StyledText style={styles.content}>{contents}</StyledText>
    </View>
  )
}

export default ContentCard

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold'
  },
})