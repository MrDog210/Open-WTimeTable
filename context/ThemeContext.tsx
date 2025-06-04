import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useColorScheme } from "react-native";

const ThemeContext = createContext<ThemeContextType | null>(null)

export function useTheme() {
  const themeCtx = useContext(ThemeContext)

  if(themeCtx === null)
    throw new Error("Theme ctx is null!")

  return themeCtx
}

export type ThemeContextType = {
  theme: "dark" | "light"
  colors: ThemeColorsType
}

export type ThemeColorsType = {
  primary: string,
  secondary: string,
  onPrimary: string,
  onSecondary: string,
  background: string,
  bottomSheetBackground:string,
  onBackground: string,
  error: string,
  onError: string,
  surface: string,
  onSurface: string,
  surfaceVariant: string,
  shadow: string,
  surfaceDisabled: string,
  onSurfaceDisabled: string,
  backdrop: string,
  touchColor: string
}

const lightMode: ThemeColorsType = {
  "primary": "rgb(186, 26, 32)",
  "onPrimary": "rgb(255, 255, 255)",
  "secondary": "rgb(176, 46, 0)",
  "onSecondary": "rgb(255, 255, 255)",
  "error": "rgb(186, 26, 26)",
  "onError": "rgb(255, 255, 255)",
  "background": "rgb(255, 251, 255)",
  "bottomSheetBackground": "rgb(190, 190, 190)",
  "onBackground": "rgb(32, 26, 25)",
  "surface": "#EAEAEA",
  "surfaceVariant": "#f4f4f4",
  "onSurface": "rgb(128 128, 128)",
  "shadow": "rgb(0, 0, 0)",
  "surfaceDisabled": "rgba(32, 26, 25, 0.12)",
  "onSurfaceDisabled": "rgba(32, 26, 25, 0.38)",
  "backdrop": "rgba(59, 45, 44, 0.4)",
  touchColor: "rgba(32, 26, 25, 0.38)"
}

const darkMode: ThemeColorsType = {
  "primary": "rgb(255, 179, 172)",
  "onPrimary": "rgb(104, 0, 8)",
  "secondary": "rgb(255, 181, 160)",
  "onSecondary": "rgb(96, 21, 0)",
  "error": "rgb(255, 180, 171)",
  "onError": "rgb(105, 0, 5)",
  "background": "rgb(32, 26, 25)",
  "bottomSheetBackground": "rgb(65, 51, 49)",
  "onBackground": "rgb(237, 224, 222)",
  "surface": "rgba(237, 224, 222, 0.32)",
  "surfaceVariant": "rgba(237, 224, 222, 0.12)",
  "onSurface": "rgb(237, 224, 222)",
  "shadow": "rgb(0, 0, 0)",
  "surfaceDisabled": "rgba(237, 224, 222, 0.12)",
  "onSurfaceDisabled": "rgba(237, 224, 222, 0.38)",
  "backdrop": "rgba(59, 45, 44, 0.4)",
  "touchColor": "rgba(237, 224, 222, 0.75)"
}

function ThemeContextProvider({children}: {children: ReactNode}) {
  const [colors, setColors] = useState<ThemeColorsType>(lightMode)
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  let colorScheme = useColorScheme();

  useEffect(() => {
    setColors(colorScheme === 'dark' ? darkMode : lightMode)
    setTheme(colorScheme ? colorScheme : 'light')
  }, [colorScheme])

  const ctx: ThemeContextType = {
    colors,
    theme
  }

  return <ThemeContext.Provider value={ctx}>{children}</ThemeContext.Provider>
}

export default ThemeContextProvider