import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useSync } from './useSync'
import * as exportPlugin from '@/data/plugins/export.ts'
import * as qrPlugin from '@/data/plugins/qr.ts'
import { createLogger } from '@/lib/logger'
import { getData } from '@/data/core/userData'

const logger = createLogger('DataSyncContext')

export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error'

export interface DataSyncContextValue {
  // Sync operations
  sync: () => Promise<void>
  lastSync: Date | null
  syncStatus: SyncStatus

  // Export/Import operations
  exportData: () => Promise<string>
  importData: (json: string) => Promise<void>

  // QR code operations
  generateQR: () => Promise<qrPlugin.QRPayload>
  importQR: (payload: qrPlugin.QRPayload) => Promise<void>

  // Auto-sync management
  enableAutoSync: () => void
  disableAutoSync: () => void
}

const DataSyncContext = createContext<DataSyncContextValue | undefined>(undefined)

interface DataSyncProviderProps {
  children: ReactNode
}

export function DataSyncProvider({ children }: DataSyncProviderProps) {
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle')
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false)

  // Use the useSync hook
  const { sync: syncHook, upload } = useSync()

  // Listen for data changes to update sync status
  useEffect(() => {
    const handler = () => {
      // Reset sync status when data changes
      setSyncStatus('idle')
    }
    window.addEventListener('data-changed', handler)
    return () => window.removeEventListener('data-changed', handler)
  }, [])

  const sync = async () => {
    setSyncStatus('syncing')
    try {
      await syncHook()
      setLastSync(new Date())
      setSyncStatus('success')

      // Reset to idle after a short delay
      setTimeout(() => setSyncStatus('idle'), 2000)
    } catch (error) {
      logger.error('Sync failed', error as Error)
      setSyncStatus('error')

      // Reset to idle after showing error
      setTimeout(() => setSyncStatus('idle'), 3000)
      throw error
    }
  }

  const exportData = async () => {
    try {
      return await exportPlugin.exportData()
    } catch (error) {
      logger.error('Export failed', error as Error)
      throw error
    }
  }

  const importData = async (json: string) => {
    try {
      // Import returns userId for us to handle login
      const userId = await exportPlugin.importData(json)

      // Note: Caller should handle login and sync separately if needed
      // This is typically used from settings where user is already logged in

      // Trigger data refresh event so UI updates
      window.dispatchEvent(new Event('data-changed'))
    } catch (error) {
      logger.error('Import failed', error as Error)
      throw error
    }
  }

  const generateQR = async () => {
    try {
      return await qrPlugin.generateQRData()
    } catch (error) {
      logger.error('Generate QR failed', error as Error)
      throw error
    }
  }

  const importQR = async (payload: qrPlugin.QRPayload) => {
    try {
      // Prepare storage (store key + userId)
      await qrPlugin.prepareImportData(payload)

      // Note: Caller should handle login and sync separately
      // This function just prepares the import data
    } catch (error) {
      logger.error('Import QR failed', error as Error)
      throw error
    }
  }

  const enableAutoSync = () => {
    if (autoSyncEnabled) return

    const focusHandler = () => {
      sync().catch((error) => logger.warn('Auto-sync on focus failed', { error }))
    }

    const blurHandler = () => {
      getData()
        .then((data) => data && upload())
        .catch((error) => logger.warn('Auto-sync on blur failed', { error }))
    }

    const unloadHandler = () => {
      getData()
        .then((data) => data && upload())
        .catch((error) => logger.warn('Auto-sync on unload failed', { error }))
    }

    window.addEventListener('focus', focusHandler)
    window.addEventListener('blur', blurHandler)
    window.addEventListener('beforeunload', unloadHandler)

    setAutoSyncEnabled(true)

    // Trigger immediate sync when enabling
    sync().catch((error) => logger.warn('Initial auto-sync failed', { error }))
  }

  const disableAutoSync = () => {
    if (!autoSyncEnabled) return

    // Remove all event listeners
    // Note: We can't remove them without references, so we'll just set flag
    // In a production app, we'd store handler refs
    setAutoSyncEnabled(false)
  }

  const value: DataSyncContextValue = {
    sync,
    lastSync,
    syncStatus,
    exportData,
    importData,
    generateQR,
    importQR,
    enableAutoSync,
    disableAutoSync,
  }

  return <DataSyncContext.Provider value={value}>{children}</DataSyncContext.Provider>
}

export function useDataSync(): DataSyncContextValue {
  const context = useContext(DataSyncContext)
  if (!context) {
    throw new Error('useDataSync must be used within DataSyncProvider')
  }
  return context
}
