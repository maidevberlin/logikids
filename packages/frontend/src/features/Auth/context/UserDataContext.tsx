import { createContext, useContext, ReactNode, useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import type { Settings } from '../../Account/Settings'
import i18n from '../../../i18n/config'

export interface UserDataContextValue {
  // Auth state
  isAuthenticated: boolean
  isLoading: boolean
  userId: string | null
  error: string | null

  // Settings (from encrypted user data)
  settings: Settings

  // Auth methods
  createAccount: (name: string, age: number, language: string) => Promise<void>
  logout: () => Promise<void>
  deleteAccount: () => Promise<void>
  sync: () => Promise<void>

  // Settings update methods
  updateName: (name: string) => Promise<void>
  updateAge: (age: number) => Promise<void>
  updateLanguage: (language: string) => Promise<void>
  updateGender: (gender: 'male' | 'female' | 'diverse' | null) => Promise<void>

  // Progress data
  progress: Record<string, any>
  updateProgress: (progress: Record<string, any>) => Promise<void>
}

const UserDataContext = createContext<UserDataContextValue | null>(null)

export function UserDataProvider({ children }: { children: ReactNode }) {
  const auth = useAuth()
  const [settings, setSettings] = useState<Settings>({
    name: '',
    age: 12,
    language: 'en',
    gender: undefined,
  })
  const [progress, setProgress] = useState<Record<string, any>>({})

  // Sync settings from user data when it changes
  useEffect(() => {
    if (auth.isAuthenticated) {
      const userData = auth.getUserData()
      setSettings({
        name: userData.settings.name || '',
        age: userData.settings.age || 12,
        language: userData.settings.language || 'en',
        gender: (userData.settings as any).gender || null,
      })
      setProgress(userData.progress || {})
    } else {
      // Load from logikids_data even for non-authenticated users
      const stored = localStorage.getItem('logikids_data')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          setSettings({
            name: parsed.settings?.name || '',
            age: parsed.settings?.age || 12,
            language: parsed.settings?.language || 'en',
            gender: parsed.settings?.gender || null,
          })
          setProgress(parsed.progress || {})
        } catch (e) {
          console.error('Failed to parse data from localStorage:', e)
        }
      }
    }
  }, [auth.isAuthenticated])

  // Listen for data sync events
  useEffect(() => {
    const handleDataSynced = (event: CustomEvent) => {
      const userData = event.detail
      setSettings({
        name: userData.settings.name || '',
        age: userData.settings.age || 12,
        language: userData.settings.language || 'en',
        gender: (userData.settings as any).gender || null,
      })
      setProgress(userData.progress || {})
    }

    window.addEventListener('data-synced' as any, handleDataSynced)
    return () => window.removeEventListener('data-synced' as any, handleDataSynced)
  }, [])

  // Sync language changes to i18n
  useEffect(() => {
    if (settings.language && i18n.language !== settings.language) {
      i18n.changeLanguage(settings.language)
    }
  }, [settings.language])

  // Update methods that sync to encrypted storage
  const updateName = async (name: string) => {
    if (auth.isAuthenticated) {
      const userData = auth.getUserData()
      await auth.updateUserData({
        settings: { ...userData.settings, name },
      })
      setSettings(prev => ({ ...prev, name }))
    } else {
      // Update logikids_data for non-authenticated users (unencrypted)
      const stored = localStorage.getItem('logikids_data')
      const current = stored ? JSON.parse(stored) : { version: 1, settings: {}, progress: {}, timestamp: Date.now() }
      current.settings.name = name
      current.timestamp = Date.now()
      localStorage.setItem('logikids_data', JSON.stringify(current))
      setSettings(prev => ({ ...prev, name }))
    }
  }

  const updateAge = async (age: number) => {
    if (auth.isAuthenticated) {
      const userData = auth.getUserData()
      await auth.updateUserData({
        settings: { ...userData.settings, age },
      })
      setSettings(prev => ({ ...prev, age }))
    } else {
      const stored = localStorage.getItem('logikids_data')
      const current = stored ? JSON.parse(stored) : { version: 1, settings: {}, progress: {}, timestamp: Date.now() }
      current.settings.age = age
      current.timestamp = Date.now()
      localStorage.setItem('logikids_data', JSON.stringify(current))
      setSettings(prev => ({ ...prev, age }))
    }
  }

  const updateLanguage = async (language: string) => {
    if (auth.isAuthenticated) {
      const userData = auth.getUserData()
      await auth.updateUserData({
        settings: { ...userData.settings, language },
      })
      setSettings(prev => ({ ...prev, language }))
    } else {
      const stored = localStorage.getItem('logikids_data')
      const current = stored ? JSON.parse(stored) : { version: 1, settings: {}, progress: {}, timestamp: Date.now() }
      current.settings.language = language
      current.timestamp = Date.now()
      localStorage.setItem('logikids_data', JSON.stringify(current))
      setSettings(prev => ({ ...prev, language }))
    }
  }

  const updateGender = async (gender: 'male' | 'female' | 'diverse' | null) => {
    if (auth.isAuthenticated) {
      const userData = auth.getUserData()
      await auth.updateUserData({
        settings: { ...userData.settings, gender },
      })
      setSettings(prev => ({ ...prev, gender }))
    } else {
      const stored = localStorage.getItem('logikids_data')
      const current = stored ? JSON.parse(stored) : { version: 1, settings: {}, progress: {}, timestamp: Date.now() }
      current.settings.gender = gender
      current.timestamp = Date.now()
      localStorage.setItem('logikids_data', JSON.stringify(current))
      setSettings(prev => ({ ...prev, gender }))
    }
  }

  const updateProgress = async (progress: Record<string, any>) => {
    if (auth.isAuthenticated) {
      await auth.updateUserData({ progress })
      setProgress(progress)
    }
  }

  const value: UserDataContextValue = {
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    userId: auth.userId,
    error: auth.error,
    settings,
    progress,
    createAccount: auth.createAccount,
    logout: auth.logout,
    deleteAccount: auth.deleteAccount,
    sync: auth.sync,
    updateName,
    updateAge,
    updateLanguage,
    updateGender,
    updateProgress,
  }

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>
}

export function useUserData() {
  const context = useContext(UserDataContext)
  if (!context) {
    throw new Error('useUserData must be used within UserDataProvider')
  }
  return context
}
