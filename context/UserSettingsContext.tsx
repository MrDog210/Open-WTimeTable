import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Storage from 'expo-sqlite/kv-store';

async function saveSettings(settings: SavedSettings) {
  return Storage.setItem('settings', JSON.stringify(settings))
}

async function loadSettings() {
  const json = await Storage.getItem('settings')
  if(!json)
    return DEFAULT_VALUES
  return JSON.parse(json) as SavedSettings
}

const ThemeContext = createContext<SettingsContextType | null>(null)

export enum DefaultView {
  WEEK_VIEW,
  DAY_VIEW
}

const DEFAULT_VALUES: SavedSettings = {
  defaultView: DefaultView.DAY_VIEW,
  hasCompletedSetup: false
}

export function useSettings() {
  const settingsCtx = useContext(ThemeContext)

  if(settingsCtx === null)
    throw new Error("Theme ctx is null!")

  return settingsCtx
}

type SavedSettings = {
  hasCompletedSetup: boolean,
  defaultView: DefaultView,
}

export interface SettingsContextType extends SavedSettings {
  isLoading: boolean
}

let didInit = false;

function ThemeContextProvider({children}: {children: ReactNode}) {
  const [isLoading, setIsLoading] = useState(true)
  const [completedSetup, setCompletedSetup] = useState<boolean>(false)
  const [defaultView, setDefaultView] = useState<DefaultView>(DefaultView.DAY_VIEW)

  useEffect(() => {
    async function setSettings() {
      const settings = await loadSettings()
      setCompletedSetup(settings.hasCompletedSetup)
      setDefaultView(settings.defaultView)
      setIsLoading(false)
    }
    if(!didInit) {
      didInit = true
      setSettings()
    }
  }, [])

  const ctx: SettingsContextType = {
    isLoading,
    hasCompletedSetup: completedSetup,
    defaultView
  }

  return <ThemeContext.Provider value={ctx}>{children}</ThemeContext.Provider>
}

export default ThemeContextProvider