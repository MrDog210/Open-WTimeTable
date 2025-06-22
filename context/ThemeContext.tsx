import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useColorScheme } from "react-native";
import { Theme, useSettings } from "./UserSettingsContext";

const ThemeContext = createContext<ThemeContextType | null>(null)

export function useTheme() {
  const themeCtx = useContext(ThemeContext)

  if(themeCtx === null)
    throw new Error("Theme ctx is null!")

  return themeCtx
}

export type ThemeContextType = {
  theme: "dark" | "light"
  colors: ThemeColorsType,
  typography: {
    fontFamily: string;
    fontSize: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
    }
  }
}

export type ThemeColorsType = {
  primary: string,
  secondary: string,
  onPrimary: string,
  onSecondary: string,
  background: string,
  onBackground: string,
  error: string,
  onError: string,
  surface: string,
  onSurface: string,
  surfaceDisabled: string,
  backdrop: string,
  touchColor: string,
  border: string,
  surfaceVariant: string
  onSurfaceVariant: string,
}

const lightMode: ThemeColorsType = {
  primary: "rgb(186, 26, 32)",
  onPrimary: "rgb(255, 255, 255)",
  secondary: "#eb5261",
  onSecondary: "rgb(255, 255, 255)",
  error: "rgb(186, 26, 26)",
  onError: "rgb(255, 255, 255)",
  background: "rgb(255, 251, 255)",
  onBackground: "rgb(32, 26, 25)",
  surface: "#f2f2f2",
  onSurface: "rgb(128 128, 128)",
  surfaceVariant: "#dedede",
  onSurfaceVariant: "black",
  surfaceDisabled: "rgba(255, 255, 255, 0.3)",
  backdrop: "rgba(59, 45, 44, 0.4)",
  touchColor: "rgba(32, 26, 25, 0.38)",
  border: '#e0e0e0',
}

const darkMode: ThemeColorsType = {
  primary: "#419bf9",
  onPrimary: "white",
  secondary: "#8CC3FC",
  onSecondary: "white",
  error: "rgb(186, 26, 26)",
  onError: "white",
  background: "#121212",
  onBackground: "rgb(237, 224, 222)",
  surface: "#1e1e1e", // TODO: change color to lighter tone
  onSurface: "rgb(237, 224, 222)",
  surfaceDisabled: "rgba(0, 0, 0, 0.3)",
  backdrop: "rgba(59, 45, 44, 0.4)",
  touchColor: "rgba(237, 224, 222, 0.75)",
  surfaceVariant: "#2C2C2C",
  onSurfaceVariant: "white",
  border: '#2c2c2c',
}

function ThemeContextProvider({children}: {children: ReactNode}) {
  const [colors, setColors] = useState<ThemeColorsType>(lightMode)
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const { theme: selectedTheme } = useSettings()
  let colorScheme = useColorScheme();

  useEffect(() => {
    console.log("selected theme", selectedTheme)
    let selectedColorScheme: typeof theme;
    if(selectedTheme === Theme.SYSTEM)
      selectedColorScheme = colorScheme === "dark" ? "dark" : "light";
    else
      selectedColorScheme = selectedTheme === Theme.LIGHT ? 'light' : 'dark'
    console.log("final theme", selectedColorScheme)

    setColors(selectedColorScheme === 'dark' ? darkMode : lightMode)
    setTheme(selectedColorScheme)
  }, [colorScheme, selectedTheme])

  const ctx: ThemeContextType = {
    colors,
    theme,
    typography: {
      fontFamily: 'System',
      fontSize: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 20,
        xl: 24,
      }
    }
  }

  return <ThemeContext.Provider value={ctx}>{children}</ThemeContext.Provider>
}

export default ThemeContextProvider