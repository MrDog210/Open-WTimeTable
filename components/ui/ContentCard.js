import { StyleSheet, View, Text } from "react-native"
import { COLORS } from "../../constants/colors"

function ContentCard({title, contents}){
  if(contents === null || contents === '')
    return
  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.content}>{contents}</Text>
    </View>
  )
}

export default ContentCard

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold'
  },
  content: {
    //color: COLORS.foreground.secondary
  }
})