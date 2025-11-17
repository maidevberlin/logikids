import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import * as syncPlugin from '@/data/plugins/sync.ts'
import * as exportPlugin from '@/data/plugins/export.ts'
import * as qrPlugin from '@/data/plugins/qr.ts'
import { createLogger } from '@/lib/logger'

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
      await syncPlugin.sync()
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
      await exportPlugin.importData(json)
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
      await qrPlugin.importQRData(payload)
    } catch (error) {
      logger.error('Import QR failed', error as Error)
      throw error
    }
  }

  const enableAutoSync = () => {
    syncPlugin.enableAutoSync()
  }

  const disableAutoSync = () => {
    syncPlugin.disableAutoSync()
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
    disableAutoSync
  }

  return (
    <DataSyncContext.Provider value={value}>
      {children}
    </DataSyncContext.Provider>
  )
}

export function useDataSync(): DataSyncContextValue {
  const context = useContext(DataSyncContext)
  if (!context) {
    throw new Error('useDataSync must be used within DataSyncProvider')
  }
  return context
}
