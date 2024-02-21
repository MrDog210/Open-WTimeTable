import { COLORS } from "./colors";

export const SPINNER_STYLE = {
  animation:"fade", 
  color:COLORS.foreground.primary,
  overlayColor:COLORS.background.primaryOpaque,
  textStyle:{color:COLORS.foreground.primary}
}

export const OPTIONS_CONTAINER_STYLE = {
  backgroundColor: COLORS.background.primary,
  paddingHorizontal: 10,
  paddingVertical: 20,
  borderWidth: 0,
  borderBottomWidth: 1,
  borderRadius: 0,
  borderColor: COLORS.foreground.secondary
}

export const OPTIONS_TEXT_STYLE = {
  color: COLORS.foreground.primary
}