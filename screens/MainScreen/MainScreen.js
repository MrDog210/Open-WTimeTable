import { useContext } from "react"
import { Text, View } from "react-native"
import { UserPreferencesContext } from "../../store/userPreferencesContext"
import StyledButton from "../../components/ui/StyledButton"

function MainScreen() {
  const userPreferencesCtx = useContext(UserPreferencesContext)
  function sraje() {
    const pref = userPreferencesCtx.preferences // should find better way of doing this
    pref.hasCompletedSetup = false
    userPreferencesCtx.setPreferences(pref)
    console.log(pref)
  }
  return (
    <View>
      <Text>Main screen!</Text>
      <StyledButton title='test' onPress={sraje}/>
    </View>
  )
}

export default MainScreen