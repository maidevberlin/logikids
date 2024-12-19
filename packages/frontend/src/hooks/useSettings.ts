import { useState, useEffect } from 'react'
import { Age } from '../types/task'
import { taskDefaults } from '../config'

interface Settings {
  age: Age
  name: string
}

const defaultSettings: Settings = {
  age: taskDefaults.age,
  name: ''
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => {
    const stored = localStorage.getItem('logikids_settings')
    return stored ? JSON.parse(stored) : defaultSettings
  })

  useEffect(() => {
    localStorage.setItem('logikids_settings', JSON.stringify(settings))
  }, [settings])

  const updateAge = (age: Age) => {
    setSettings(prev => ({ ...prev, age }))
  }

  const updateName = (name: string) => {
    setSettings(prev => ({ ...prev, name }))
  }

  return {
    settings,
    updateAge,
    updateName
  }
} 