import { createContext, useState, useEffect, ReactNode } from 'react'
import { UserData, UserSettings } from '@/data/core/types.ts'
import {
  initialize,
  getData,
  updateSettings as coreUpdateSettings,
  updateProgress as coreUpdateProgress,
  updateGameStats as coreUpdateGameStats,
} from '@/data/core/userData.ts'
import { GameStats } from '@/app/stats/gameTypes'
import { useAuth } from './AuthContext'
import { useDataSync } from './DataSyncContext'

export interface UserDataContextValue {
  data: UserData | null
  isLoading: boolean
  error: Error | null

  // Core operations
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>
  updateProgress: (progress: Record<string, any>) => Promise<void>
  updateGameStats: (gameStats: GameStats) => Promise<void>
  refresh: () => Promise<void>
}

export const UserDataContext = createContext<UserDataContextValue | null>(null)

interface UserDataProviderProps {
  children: ReactNode
}

export function UserDataProvider({ children }: UserDataProviderProps) {
  const auth = useAuth() // Use AuthContext for authentication state
  const dataSync = useDataSync() // Use DataSyncContext for sync operations
  const [data, setData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Initialize once (depends on auth being ready)
  useEffect(() => {
    if (auth.authLoading) {
      return // Wait for auth to initialize first
    }

    initialize()
      .then((d) => setData(d))
      .catch((e) => setError(e))
      .finally(() => setIsLoading(false))
  }, [auth.authLoading])

  // Listen for data changes
  useEffect(() => {
    const handler = () => refresh()
    window.addEventListener('data-changed', handler)
    return () => window.removeEventListener('data-changed', handler)
  }, [])

  // Enable/disable auto-sync based on user setting
  useEffect(() => {
    if (data?.settings.syncEnabled) {
      dataSync.enableAutoSync()
      return () => dataSync.disableAutoSync()
    } else {
      dataSync.disableAutoSync()
    }
  }, [data?.settings.syncEnabled, dataSync])

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

  const value: UserDataContextValue = {
    data,
    isLoading,
    error,
    updateSettings,
    updateProgress,
    updateGameStats,
    refresh,
  }

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>
}
