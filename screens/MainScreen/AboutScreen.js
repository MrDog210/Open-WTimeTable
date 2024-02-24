import { Image, ScrollView, StyleSheet } from "react-native"
import Title from "../../components/ui/Title"
import Line from "../../components/ui/Line"
import StyledText from "../../components/ui/StyledText"
import OptionsButton from "../../components/ui/options/OptionsButton"
import * as Linking from 'expo-linking';
import { CONTR_MRDOG210, GITHUB_REPO, LICENSE } from "../../constants/urls"

function AboutScreen() {
  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Open W TimeTables</Title>
      <Image source={require('./../../assets/open_source_icon.png')} style={styles.image} />
      <Line />
      <StyledText>This application, developed using React Native and Expo, is an open-source implementation of Wise TimeTables. Please note that the app is provided as-is, without any warranty or liability.</StyledText>
      <Title style={styles.subtitle}>Links</Title>
      <OptionsButton title='GitHub repository' onPress={() => Linking.openURL(GITHUB_REPO)}/>
      <OptionsButton title='GNU GPL V3 license' onPress={() => Linking.openURL(LICENSE)}/>
      <Title style={styles.subtitle}>Contributors:</Title>
      <OptionsButton title='MrDog210' onPress={() => Linking.openURL(CONTR_MRDOG210)}/>
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