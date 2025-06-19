import { ScrollView, Image, Linking, StyleSheet, View } from "react-native"
import Text from "../../components/ui/Text"
import Divider from "../../components/ui/Divider"
import Button from "../../components/ui/Button"
import { CONTR_MRDOG210, CONTR_MZHAP, GITHUB_REPO, LICENSE } from "../../util/constants"

function AboutScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ gap: 10 }}>
      <Text style={styles.title}>Open Wise TimeTable</Text>
      <View style={styles.imagesContainer}>
        <Image source={require('./../../assets/open_source_icon.png')} style={styles.image} />
        <Image source={require('./../../assets/adaptive-icon.png')} style={{width: 90, height: 90}} />
      </View>
      <Divider />
      <Text style={styles.infoText}>This application, developed using React Native and Expo, is an open-source implementation of Wise TimeTables. Please note that the app is provided as-is, without any warranty or liability.</Text>
      <Divider />
      <View>
        <Text style={styles.subtitle}>Links:</Text>
        <Button mode="TRANSPARENT" onPress={() => Linking.openURL(GITHUB_REPO)}>GitHub repository</Button>
        <Button mode="TRANSPARENT" onPress={() => Linking.openURL(LICENSE)}>GNU GPL V3 license</Button>
      </View>
      <Divider />
     <View>
       <Text style={styles.subtitle}>Contributors:</Text>
        <Button mode="TRANSPARENT" onPress={() => Linking.openURL(CONTR_MRDOG210)}>MrDog210</Button>
        <Button mode="TRANSPARENT" onPress={() => Linking.openURL(CONTR_MZHAP)}>mzHap</Button>
     </View>
    </ScrollView>
  )
}

export default AboutScreen

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    marginVertical: 10,
  },
  imagesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold'
  },
  subtitle: {
    textAlign: 'center',
    padding: 10,
    fontWeight: 'bold'
  },
  infoText: {
    paddingVertical: 6
  },
  image: {
    width: 50,
    height: 50,
  }
})