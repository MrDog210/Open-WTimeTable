import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import * as SplashScreen from 'expo-splash-screen';
import { storage } from "../util/constants";

async function saveSettings(settings: SavedSettings) {
  return storage.setItem('settings', JSON.stringify(settings))
}

async function loadSettings() {
  const json = await storage.getItem('settings')
  if(!json)
    return DEFAULT_VALUES
  const savedSettings = await JSON.parse(json) as SavedSettings

  return {
    ...DEFAULT_VALUES,
    ...savedSettings
  }
}

const ThemeContext = createContext<SettingsContextType | null>(null)

export enum DefaultView {
  WEEK_VIEW,
  DAY_VIEW
}

export enum Theme {
  SYSTEM,
  LIGHT,
  DARK
}

const DEFAULT_VALUES: SavedSettings = {
  defaultView: DefaultView.DAY_VIEW,
  hasCompletedSetup: false,
  timetableAnimationsEnabled: false,
  theme: Theme.SYSTEM
}

export function useSettings() {
  const settingsCtx = useContext(ThemeContext)

  if(settingsCtx === null)
    throw new Error("Settings ctx is null!")

  return settingsCtx
}

type SavedSettings = {
  hasCompletedSetup: boolean,
  defaultView: DefaultView,
  timetableAnimationsEnabled: boolean,
  theme: Theme,
  //language: // TODO: add multiple language support
}

export interface SettingsContextType extends SavedSettings {
  isLoading: boolean
  changeSettings: (settings: Partial<SavedSettings>) => Promise<unknown>
}

let didInit = false;

SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 400,
  fade: true,
});

function UserSettingsContextProvider({children}: {children: ReactNode}) {
  const [isLoading, setIsLoading] = useState(true)
  const [settings, setSettings] = useState<SavedSettings>(DEFAULT_VALUES)
  // TODO: move splash screen and loading block here
  useEffect(() => {
    async function loadAndSetSettings() {
      const savedSettings = await loadSettings()
      setSettings(savedSettings)
      setIsLoading(false)
      SplashScreen.hide()
    }
    if(!didInit) {
      didInit = true
      loadAndSetSettings()
    }
  }, [])

  function changeSettings(nevValues: Partial<SavedSettings>) {
    const newSettings: SavedSettings = {
      ...settings,
      ...nevValues
    }
    setSettings(newSettings)
    return saveSettings(newSettings)
  }

  const ctx: SettingsContextType = {
    isLoading,
    ...settings,
    changeSettings: changeSettings
  }
  
  if(isLoading)
    return <></>

  return <ThemeContext.Provider value={ctx}>{children}</ThemeContext.Provider>
}

export default UserSettingsContextProvider