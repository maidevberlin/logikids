import { trpc } from '@/api/trpc'
import { getUserId, loadKey } from '@/data/core/storage'
import { encrypt, decrypt } from '@/data/core/crypto'
import { getData, setData } from '@/data/core/userData'
import { createLogger } from '@/lib/logger'

const logger = createLogger('useSync')

/**
 * Calculate SHA-256 checksum
 */
async function calculateChecksum(data: Uint8Array): Promise<string> {
  const hashBuffer = await crypto.subtle.digest(
    'SHA-256',
    (data.buffer as ArrayBuffer).slice(data.byteOffset, data.byteOffset + data.byteLength)
  )
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export function useSync() {
  // tRPC hooks
  const uploadMutation = trpc.sync.upload.useMutation()
  const utils = trpc.useUtils()

  /**
   * Upload user data to server
   */
  const upload = async (): Promise<void> => {
    try {
      const data = await getData()
      if (!data) {
        throw new Error('No user data to upload')
      }

      const key = await loadKey()
      if (!key) {
        throw new Error('Encryption key not found')
      }

      const encrypted = await encrypt(key, data)

      // Extract IV from encrypted blob (first 12 bytes)
      const encryptedBytes = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0))
      const iv = encryptedBytes.slice(0, 12)
      const ivBase64 = btoa(String.fromCharCode(...iv))

      // Calculate checksum of the entire encrypted blob (IV + ciphertext)
      const ciphertext = encryptedBytes.slice(12)
      const checksum = await calculateChecksum(encryptedBytes)

      const payload = {
        encryptedBlob: btoa(String.fromCharCode(...ciphertext)),
        iv: ivBase64,
        timestamp: data.timestamp,
        checksum,
      }

      const userId = await getUserId()
      if (!userId) {
        throw new Error('User ID not found')
      }

      await uploadMutation.mutateAsync({ userId, payload })
    } catch (error) {
      logger.error('Upload failed', error as Error)
      throw error
    }
  }

  /**
   * Download user data from server
   */
  const download = async () => {
    try {
      const userId = await getUserId()
      if (!userId) {
        throw new Error('User ID not found')
      }

      // Use tRPC query via utils.client
      const payload = await utils.client.sync.download.query({ userId })

      if (!payload) {
        // User not found on server (first sync)
        return null
      }

      // Reconstruct full encrypted blob (IV + ciphertext) for checksum verification
      const iv = Uint8Array.from(atob(payload.iv), (c) => c.charCodeAt(0))
      const ciphertext = Uint8Array.from(atob(payload.encryptedBlob), (c) => c.charCodeAt(0))
      const combined = new Uint8Array(iv.length + ciphertext.length)
      combined.set(iv, 0)
      combined.set(ciphertext, iv.length)

      // Verify checksum of the entire encrypted blob (IV + ciphertext)
      const calculatedChecksum = await calculateChecksum(combined)

      if (calculatedChecksum !== payload.checksum) {
        throw new Error('Data integrity check failed - checksum mismatch')
      }

      const encryptedBlob = btoa(String.fromCharCode(...combined))

      const key = await loadKey()
      if (!key) {
        throw new Error('Encryption key not found')
      }

      return await decrypt(key, encryptedBlob)
    } catch (error) {
      logger.error('Download failed', error as Error)
      throw error
    }
  }

  /**
   * Sync: Smart merge with last-write-wins conflict resolution
   */
  const sync = async (): Promise<void> => {
    try {
      const local = await getData()
      const remote = await download()

      // If no local data (e.g., fresh import), just restore from remote
      if (!local) {
        if (remote) {
          // Import case: we have remote data but no local data yet
          // Write directly to localStorage since setData requires existing data
          const key = await loadKey()
          if (!key) throw new Error('Encryption key not found')

          const encrypted = await encrypt(key, { ...remote, lastSyncTimestamp: Date.now() })
          localStorage.setItem('logikids_data', encrypted)

          // Dispatch event for React reactivity
          window.dispatchEvent(new Event('data-changed'))
        }
        return
      }

      if (!remote) {
        // No remote data, upload local
        await upload()
        await setData({ lastSyncTimestamp: Date.now() })
        return
      }

      // Compare timestamps
      if (remote.timestamp > local.timestamp) {
        // Remote is newer, update local
        await setData({ ...remote, lastSyncTimestamp: Date.now() })
      } else {
        // Local is newer, upload
        await upload()
        await setData({ lastSyncTimestamp: Date.now() })
      }
    } catch (error) {
      logger.warn('Sync failed, continuing offline', { error })
      // Don't throw - sync is optional
    }
  }

  return {
    upload,
    download,
    sync,
    isUploading: uploadMutation.isPending,
  }
}
