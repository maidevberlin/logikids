import { useState, useEffect } from 'react'
import { Settings, defaultSettings } from './types'

const STORAGE_KEY = 'logikids_settings'

// Create a shared event emitter for synchronizing settings across hook instances
const settingsEmitter = new EventTarget()
const SETTINGS_UPDATE = 'settings-update'

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : defaultSettings
  })

  useEffect(() => {
    const handleSettingsUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<Settings>
      setSettings(customEvent.detail)
    }

    // Subscribe to settings updates
    settingsEmitter.addEventListener(SETTINGS_UPDATE, handleSettingsUpdate)

    return () => {
      settingsEmitter.removeEventListener(SETTINGS_UPDATE, handleSettingsUpdate)
    }
  }, [])

  // Update localStorage and notify other hook instances when settings change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    settingsEmitter.dispatchEvent(new CustomEvent(SETTINGS_UPDATE, { detail: settings }))
  }, [settings])

  const updateAge = (age: Settings['age']) => {
    setSettings(prev => ({ ...prev, age }))
  }

  const updateName = (name: Settings['name']) => {
    setSettings(prev => ({ ...prev, name }))
  }

  const updateLanguage = (language: Settings['language']) => {
    setSettings(prev => ({ ...prev, language }))
  }

  const updateGender = (gender: Settings['gender']) => {
    setSettings(prev => ({ ...prev, gender }))
  }

  return {
    settings,
    updateAge,
    updateName,
    updateLanguage,
    updateGender
  }
} 