/**
 * Sync service for encrypted data synchronization with server
 * Handles upload/download of encrypted user data
 */

import { cryptoService, type EncryptedPayload } from './crypto.service'
import { storageService } from './storage.service'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5175'

export interface SyncStatus {
  isSyncing: boolean
  lastSyncTime: number | null
  error: string | null
}

class SyncService {
  private isSyncing = false
  private lastSyncTime: number | null = null
  private syncListeners: Array<(status: SyncStatus) => void> = []

  /**
   * Upload encrypted data to server
   */
  async upload(userId: string, key: CryptoKey, data: any): Promise<void> {
    if (this.isSyncing) {
      console.log('[SyncService] Already syncing, skipping upload')
      return
    }

    this.isSyncing = true
    this.notifyListeners()

    try {
      // Encrypt data
      const encrypted = await cryptoService.encrypt(key, data)

      // Upload to server
      const response = await fetch(`${API_BASE_URL}/api/sync/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(encrypted),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      this.lastSyncTime = Date.now()
      console.log('[SyncService] Upload successful')
    } catch (error) {
      console.error('[SyncService] Upload failed:', error)
      throw error
    } finally {
      this.isSyncing = false
      this.notifyListeners()
    }
  }

  /**
   * Download encrypted data from server
   */
  async download(userId: string, key: CryptoKey): Promise<any | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sync/${userId}`)

      if (response.status === 404) {
        // New user, no data yet
        return null
      }

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Download failed')
      }

      const encrypted: EncryptedPayload = await response.json()

      // Decrypt data
      const decrypted = await cryptoService.decrypt(key, encrypted)

      this.lastSyncTime = Date.now()
      console.log('[SyncService] Download successful')

      return decrypted
    } catch (error) {
      console.error('[SyncService] Download failed:', error)
      throw error
    }
  }

  /**
   * Sync: Download from server and merge with local data
   * Uses last-write-wins strategy
   */
  async sync(userId: string, key: CryptoKey, localData: any): Promise<any> {
    try {
      // Download from server
      const serverData = await this.download(userId, key)

      if (!serverData) {
        // No server data, upload local data
        await this.upload(userId, key, localData)
        return localData
      }

      // Compare timestamps (last-write-wins)
      if (serverData.timestamp > localData.timestamp) {
        console.log('[SyncService] Server data is newer, using server version')
        return serverData
      } else if (localData.timestamp > serverData.timestamp) {
        console.log('[SyncService] Local data is newer, uploading')
        await this.upload(userId, key, localData)
        return localData
      }

      // Timestamps equal, data is in sync
      console.log('[SyncService] Data is already in sync')
      return localData
    } catch (error) {
      console.error('[SyncService] Sync failed:', error)
      throw error
    }
  }

  /**
   * Delete user data from server (GDPR right to erasure)
   */
  async deleteAccount(userId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sync/${userId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Delete failed')
      }

      console.log('[SyncService] Account deleted from server')
    } catch (error) {
      console.error('[SyncService] Delete failed:', error)
      throw error
    }
  }

  /**
   * Verify user exists on server
   */
  async verify(userId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sync/${userId}/verify`, {
        method: 'POST',
      })

      if (!response.ok) {
        return false
      }

      const { exists } = await response.json()
      return exists
    } catch (error) {
      console.error('[SyncService] Verify failed:', error)
      return false
    }
  }

  /**
   * Setup automatic sync on window focus/blur
   */
  setupAutoSync(getUserData: () => any): void {
    // Sync on window focus (download latest from server)
    window.addEventListener('focus', async () => {
      console.log('[SyncService] Window focused, syncing from server...')
      try {
        const userId = await storageService.getUserId()
        const key = await storageService.getKey()

        if (!userId || !key) return

        const localData = getUserData()
        const syncedData = await this.sync(userId, key, localData)

        // If server data was newer, update local storage
        if (syncedData !== localData) {
          localStorage.setItem('logikids_data', JSON.stringify(syncedData))
          window.dispatchEvent(new CustomEvent('data-synced', { detail: syncedData }))
        }
      } catch (error) {
        console.error('[SyncService] Auto-sync on focus failed:', error)
      }
    })

    // Sync on window blur (upload local changes to server)
    window.addEventListener('blur', async () => {
      console.log('[SyncService] Window blurred, uploading to server...')
      try {
        const userId = await storageService.getUserId()
        const key = await storageService.getKey()

        if (!userId || !key) return

        const localData = getUserData()
        await this.upload(userId, key, localData)
      } catch (error) {
        console.error('[SyncService] Auto-sync on blur failed:', error)
      }
    })

    // Sync before page unload
    window.addEventListener('beforeunload', async () => {
      try {
        const userId = await storageService.getUserId()
        const key = await storageService.getKey()

        if (!userId || !key) return

        const localData = getUserData()
        await this.upload(userId, key, localData)
      } catch (error) {
        console.error('[SyncService] Sync before unload failed:', error)
      }
    })
  }

  /**
   * Subscribe to sync status changes
   */
  onSyncStatusChange(listener: (status: SyncStatus) => void): () => void {
    this.syncListeners.push(listener)

    // Return unsubscribe function
    return () => {
      this.syncListeners = this.syncListeners.filter(l => l !== listener)
    }
  }

  /**
   * Get current sync status
   */
  getSyncStatus(): SyncStatus {
    return {
      isSyncing: this.isSyncing,
      lastSyncTime: this.lastSyncTime,
      error: null,
    }
  }

  /**
   * Notify all listeners of status change
   */
  private notifyListeners(): void {
    const status = this.getSyncStatus()
    this.syncListeners.forEach(listener => listener(status))
  }
}

// Export singleton instance
export const syncService = new SyncService()
