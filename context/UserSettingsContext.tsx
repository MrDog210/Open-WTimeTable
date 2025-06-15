import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Storage from 'expo-sqlite/kv-store';

async function saveSettings(settings: SavedSettings) {
  return Storage.setItem('settings', JSON.stringify(settings))
}

async function loadSettings() {
  const json = await Storage.getItem('settings')
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

const DEFAULT_VALUES: SavedSettings = {
  defaultView: DefaultView.DAY_VIEW,
  hasCompletedSetup: false,
  timetableAnimationsEnabled: false
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
  timetableAnimationsEnabled: boolean
}

export interface SettingsContextType extends SavedSettings {
  isLoading: boolean
  changeSettings: (settings: Partial<SavedSettings>) => Promise<unknown>
}

let didInit = false;

function UserSettingsContextProvider({children}: {children: ReactNode}) {
  const [isLoading, setIsLoading] = useState(true)
  const [settings, setSettings] = useState<SavedSettings>(DEFAULT_VALUES)

  useEffect(() => {
    async function loadAndSetSettings() {
      const savedSettings = await loadSettings()
      setSettings(savedSettings)
      setIsLoading(false)
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

  return <ThemeContext.Provider value={ctx}>{children}</ThemeContext.Provider>
}

export default UserSettingsContextProvider