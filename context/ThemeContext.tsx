import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useColorScheme } from "react-native";
import { Theme, useSettings } from "./UserSettingsContext";
import { ThemeColorsType } from "../types/types";
import { DARK_MODE_COLORS, LIGHT_MODE_COLORS } from "../util/constants";

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

function ThemeContextProvider({children}: {children: ReactNode}) {
  const [colors, setColors] = useState<ThemeColorsType>(LIGHT_MODE_COLORS)
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

    setColors(selectedColorScheme === 'dark' ? DARK_MODE_COLORS : LIGHT_MODE_COLORS)
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