/**
 * Privacy-First Sync Infrastructure
 * ==================================
 *
 * This module handles synchronization of user data across devices while maintaining
 * privacy-first principles:
 *
 * 1. All data is encrypted client-side before leaving the device
 * 2. Server only stores opaque encrypted blobs - cannot read user data
 * 3. Encryption key never leaves the client
 *
 * SYNC PROTOCOL (always follows this order):
 * ------------------------------------------
 * 1. DOWNLOAD - Fetch encrypted blob from server, decrypt locally
 * 2. MERGE    - Combine local + remote data (no data loss)
 * 3. UPLOAD   - Encrypt merged result, send to server
 *
 * This ensures data from all devices is preserved. Race conditions are minimized
 * to simultaneous syncs only (extremely unlikely for single user).
 */

import { trpc } from '@/app/common/trpc'
import {
  getUserId,
  loadKey,
  encrypt,
  decrypt,
  getData,
  setData,
  mergeUserData,
} from '@/app/user/storage'
import { UserData } from '@/app/user/types'
import { createLogger } from '@/app/common/logger'

const logger = createLogger('useSync')

/**
 * Calculate SHA-256 checksum for data integrity verification
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
  const uploadMutation = trpc.sync.upload.useMutation()
  const utils = trpc.useUtils()

  // ============================================================================
  // STEP 1: DOWNLOAD - Fetch and decrypt remote data
  // ============================================================================
  const download = async (): Promise<UserData | null> => {
    const userId = await getUserId()
    if (!userId) {
      throw new Error('User ID not found')
    }

    const payload = await utils.client.sync.download.query({ userId })

    if (!payload) {
      return null // No remote data exists yet
    }

    // Reconstruct encrypted blob and verify integrity
    const iv = Uint8Array.from(atob(payload.iv), (c) => c.charCodeAt(0))
    const ciphertext = Uint8Array.from(atob(payload.encryptedBlob), (c) => c.charCodeAt(0))
    const combined = new Uint8Array(iv.length + ciphertext.length)
    combined.set(iv, 0)
    combined.set(ciphertext, iv.length)

    const calculatedChecksum = await calculateChecksum(combined)
    if (calculatedChecksum !== payload.checksum) {
      throw new Error('Data integrity check failed - checksum mismatch')
    }

    const key = await loadKey()
    if (!key) {
      throw new Error('Encryption key not found')
    }

    const encryptedBlob = btoa(String.fromCharCode(...combined))
    return await decrypt<UserData>(key, encryptedBlob)
  }

  // ============================================================================
  // STEP 3: UPLOAD - Encrypt and send data to server
  // ============================================================================
  const upload = async (data: UserData): Promise<void> => {
    const key = await loadKey()
    if (!key) {
      throw new Error('Encryption key not found')
    }

    const encrypted = await encrypt(key, data)

    // Extract IV and ciphertext
    const encryptedBytes = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0))
    const iv = encryptedBytes.slice(0, 12)
    const ciphertext = encryptedBytes.slice(12)
    const checksum = await calculateChecksum(encryptedBytes)

    const payload = {
      encryptedBlob: btoa(String.fromCharCode(...ciphertext)),
      iv: btoa(String.fromCharCode(...iv)),
      timestamp: data.timestamp,
      checksum,
    }

    const userId = await getUserId()
    if (!userId) {
      throw new Error('User ID not found')
    }

    await uploadMutation.mutateAsync({ userId, payload })
  }

  // ============================================================================
  // SYNC: The complete sync operation (DOWNLOAD → MERGE → UPLOAD)
  // ============================================================================
  const sync = async (): Promise<void> => {
    try {
      // ---- STEP 1: DOWNLOAD ----
      const remote = await download()

      // ---- Get local data ----
      const local = await getData()

      // ---- Handle edge cases ----
      if (!local && !remote) {
        // Nothing to sync
        return
      }

      if (!local && remote) {
        // Fresh device with remote data: restore from remote
        const key = await loadKey()
        if (!key) throw new Error('Encryption key not found')

        const dataWithSync = { ...remote, lastSyncTimestamp: Date.now() }
        const encrypted = await encrypt(key, dataWithSync)
        localStorage.setItem('logikids_data', encrypted)
        window.dispatchEvent(new Event('data-changed'))
        return
      }

      if (local && !remote) {
        // First sync: upload local data
        await upload(local)
        await setData({ lastSyncTimestamp: Date.now() }, local)
        return
      }

      // ---- STEP 2: MERGE ----
      // Both local and remote exist - merge them
      const merged = mergeUserData(local!, remote!)

      // ---- STEP 3: UPLOAD ----
      await upload(merged)

      // ---- Save merged result locally (pass merged to avoid redundant read) ----
      await setData({ lastSyncTimestamp: Date.now() }, merged)

      logger.debug('Sync complete', {
        localAttempts: countAttempts(local!),
        remoteAttempts: countAttempts(remote!),
        mergedAttempts: countAttempts(merged),
      })
    } catch (error) {
      logger.warn('Sync failed, continuing offline', { error })
      // Don't throw - sync is optional, app works offline
    }
  }

  // Legacy upload function for backward compatibility (blur/unload handlers)
  const uploadCurrentData = async (): Promise<void> => {
    const data = await getData()
    if (!data) {
      throw new Error('No user data to upload')
    }
    await upload(data)
  }

  return {
    sync,
    download,
    upload: uploadCurrentData,
    isUploading: uploadMutation.isPending,
  }
}

/**
 * Count total attempts across all concepts (for logging)
 */
function countAttempts(data: UserData): number {
  let count = 0
  for (const subject of Object.values(data.progress)) {
    for (const concept of Object.values(subject)) {
      count += concept.attempts.length
    }
  }
  return count
}
