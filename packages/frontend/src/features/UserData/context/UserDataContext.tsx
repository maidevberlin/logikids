import React, { createContext, useState, useEffect, ReactNode } from 'react'
import { UserData, UserSettings } from '../core/types'
import { initialize, getData, updateSettings as coreUpdateSettings, updateProgress as coreUpdateProgress } from '../core/userData'
import * as syncPlugin from '../plugins/sync'
import * as exportPlugin from '../plugins/export'
import * as qrPlugin from '../plugins/qr'

export interface UserDataContextValue {
  data: UserData | null
  isLoading: boolean
  error: Error | null

  // Core operations
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>
  updateProgress: (progress: Record<string, any>) => Promise<void>
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
  enableAutoSync?: boolean
}

export function UserDataProvider({ children, enableAutoSync = true }: UserDataProviderProps) {
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

  // Enable auto-sync
  useEffect(() => {
    if (enableAutoSync) {
      syncPlugin.enableAutoSync()
      return () => syncPlugin.disableAutoSync()
    }
  }, [enableAutoSync])

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
    updateSettings,
    updateProgress,
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
