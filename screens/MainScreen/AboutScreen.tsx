import { ScrollView, Image, Linking, StyleSheet } from "react-native"
import Text from "../../components/ui/Text"
import Divider from "../../components/ui/Divider"
import Button from "../../components/ui/Button"
import { CONTR_MRDOG210, CONTR_MZHAP, GITHUB_REPO, LICENSE } from "../../util/constants"

function AboutScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Open Wise TimeTable</Text>
      <Image source={require('./../../assets/open_source_icon.png')} style={styles.image} />
      <Divider />
      <Text>This application, developed using React Native and Expo, is an open-source implementation of Wise TimeTables. Please note that the app is provided as-is, without any warranty or liability.</Text>
      <Text style={styles.subtitle}>Links</Text>
      <Button onPress={() => Linking.openURL(GITHUB_REPO)}>GitHub repository</Button>
      <Button onPress={() => Linking.openURL(LICENSE)}>GNU GPL V3 license</Button>
      <Text style={styles.subtitle}>Contributors:</Text>
      <Button onPress={() => Linking.openURL(CONTR_MRDOG210)}>MrDog210</Button>
      <Button onPress={() => Linking.openURL(CONTR_MZHAP)}>mzHap</Button>
    </ScrollView>
  )
}

export default AboutScreen

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 10
  },
  title: {
    textAlign: 'center'
  },
  subtitle: {
    textAlign: 'center',
    paddingTop: 30
  },
  image: {
    width: 50,
    height: 50,
    alignSelf: 'center'
  }
})