import { createContext, useState, useEffect, ReactNode } from 'react'
import { UserData, UserSettings } from '@/data/core/types.ts'
import {
  initialize,
  getData,
  updateSettings as coreUpdateSettings,
  updateProgress as coreUpdateProgress,
  updateGameStats as coreUpdateGameStats,
  updateProgressAndGameStats as coreUpdateProgressAndGameStats,
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
  updateProgressAndGameStats: (progress: Record<string, any>, gameStats: GameStats) => Promise<void>
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Core operations - use returned data to avoid redundant reads
  const updateSettings = async (settings: Partial<UserSettings>) => {
    const updated = await coreUpdateSettings(settings)
    setData(updated)
  }

  const updateProgress = async (progress: Record<string, any>) => {
    const updated = await coreUpdateProgress(progress)
    setData(updated)

    // Sync after task completion if sync is enabled
    if (updated.settings.syncEnabled) {
      dataSync.sync().catch((err) => {
        console.warn('Background sync after task failed', err)
      })
    }
  }

  const updateGameStats = async (gameStats: GameStats) => {
    const updated = await coreUpdateGameStats(gameStats)
    setData(updated)

    // Sync after game stats update if sync is enabled
    if (updated.settings.syncEnabled) {
      dataSync.sync().catch((err) => {
        console.warn('Background sync after stats update failed', err)
      })
    }
  }

  // Batched update for progress + gameStats (single read, single write, single sync)
  const updateProgressAndGameStats = async (
    progress: Record<string, any>,
    gameStats: GameStats
  ) => {
    const updated = await coreUpdateProgressAndGameStats(progress, gameStats)
    setData(updated)

    // Single sync after both updates
    if (updated.settings.syncEnabled) {
      dataSync.sync().catch((err) => {
        console.warn('Background sync after task failed', err)
      })
    }
  }

  const value: UserDataContextValue = {
    data,
    isLoading,
    error,
    updateSettings,
    updateProgress,
    updateGameStats,
    updateProgressAndGameStats,
    refresh,
  }

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>
}
