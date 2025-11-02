import { createContext, useState, useEffect, ReactNode } from 'react'
import { UserData, UserSettings } from '@/data/core/types.ts'
import { initialize, getData, createNewUser as coreCreateNewUser, updateSettings as coreUpdateSettings, updateProgress as coreUpdateProgress, updateGameStats as coreUpdateGameStats } from '@/data/core/userData.ts'
import * as syncPlugin from '@/data/plugins/sync.ts'
import * as exportPlugin from '@/data/plugins/export.ts'
import * as qrPlugin from '@/data/plugins/qr.ts'
import { GameStats } from '@/app/stats/gameTypes'

export interface UserDataContextValue {
  data: UserData | null
  isLoading: boolean
  error: Error | null

  // Core operations
  createNewUser: () => Promise<void>
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>
  updateProgress: (progress: Record<string, any>) => Promise<void>
  updateGameStats: (gameStats: GameStats) => Promise<void>
  refresh: () => Promise<void>

  // Plugin operations
  sync: () => Promise<void>
  exportData: () => Promise<string>
  importData: (json: string) => Promise<void>
  generateQR: () => Promise<qrPlugin.QRPayload>
  importQR: (payload: qrPlugin.QRPayload) => Promise<void>
}

export const UserDataContext = createContext<UserDataContextValue | null>(null)

interface UserDataProviderProps {
  children: ReactNode
}

export function UserDataProvider({ children }: UserDataProviderProps) {
  const [data, setData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Initialize once
  useEffect(() => {
    initialize()
      .then(d => setData(d))
      .catch(e => setError(e))
      .finally(() => setIsLoading(false))
  }, [])

  // Listen for data changes
  useEffect(() => {
    const handler = () => refresh()
    window.addEventListener('data-changed', handler)
    return () => window.removeEventListener('data-changed', handler)
  }, [])

  // Enable/disable auto-sync based on user setting
  useEffect(() => {
    if (data?.settings.syncEnabled) {
      syncPlugin.enableAutoSync()
      return () => syncPlugin.disableAutoSync()
    } else {
      syncPlugin.disableAutoSync()
    }
  }, [data?.settings.syncEnabled])

  const refresh = async () => {
    try {
      const updated = await getData()
      setData(updated)
      setError(null)
    } catch (e) {
      setError(e as Error)
    }
  }

  // Core operations (pass-through to core)
  const createNewUser = async () => {
    await coreCreateNewUser()
    await refresh()
  }

  const updateSettings = async (settings: Partial<UserSettings>) => {
    await coreUpdateSettings(settings)
    await refresh()
  }

  const updateProgress = async (progress: Record<string, any>) => {
    await coreUpdateProgress(progress)
    await refresh()
  }

  const updateGameStats = async (gameStats: GameStats) => {
    await coreUpdateGameStats(gameStats)
    await refresh()
  }

  // Plugin operations
  const sync = async () => {
    await syncPlugin.sync()
    await refresh()
  }

  const exportData = async () => {
    return await exportPlugin.exportData()
  }

  const importData = async (json: string) => {
    await exportPlugin.importData(json)
    await refresh()
  }

  const generateQR = async () => {
    return await qrPlugin.generateQRData()
  }

  const importQR = async (payload: qrPlugin.QRPayload) => {
    await qrPlugin.importQRData(payload)
    await refresh()
  }

  const value: UserDataContextValue = {
    data,
    isLoading,
    error,
    createNewUser,
    updateSettings,
    updateProgress,
    updateGameStats,
    refresh,
    sync,
    exportData,
    importData,
    generateQR,
    importQR
  }

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  )
}
