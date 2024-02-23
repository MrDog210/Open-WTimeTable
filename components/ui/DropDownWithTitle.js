import DropDownPicker from "react-native-dropdown-picker"
import StyledText from "./StyledText"
import { StyleSheet, View } from "react-native"
import { COLORS, isDarkTheme } from "../../constants/colors"

function DropDownWithTitle({title, ...props}) {
  return (
    <View style={styles.container}>
      <StyledText style={styles.title}>{title}</StyledText>
      <DropDownPicker
        {...props}

        modalTitle={title}
        listMode="MODAL"
        style={{borderRadius: 0, borderWidth: 1, borderColor: COLORS.foreground.secondary, backgroundColor: COLORS.background.primary}}
        containerStyle={{}}
        textStyle={{color: COLORS.foreground.primary}}
        labelStyle={{}}
        modalContentContainerStyle={{backgroundColor: COLORS.background.primary}}
        modalTitleStyle={{color: COLORS.foreground.primary, fontWeight: 'bold'}}
        modalAnimationType="slide"

        showBadgeDot={false}
        extendableBadgeContainer={true}
        badgeStyle={{
          borderRadius: 0,
          paddingHorizontal: 0,
          paddingVertical: 0
        }}
        badgeTextStyle={{
          color: COLORS.foreground.primary,
          backgroundColor: COLORS.background.seperator,
          paddingHorizontal: 10,
          paddingVertical: 5
        }}
        badgeSeparatorStyle={{

        }}
        theme={isDarkTheme ? "DARK" : "LIGHT"}
      />
    </View>
  )
}

export default DropDownWithTitle

const styles = StyleSheet.create({
  container: {
    gap: 5,
    paddingVertical: 5
  },
  title: {
    paddingHorizontal: 5,
    fontWeight: 'bold'
  }
})