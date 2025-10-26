import { UserData } from '../core/types'
import { getData, setData } from '../core/userData'
import { loadKey, getUserId } from '../core/storage'
import { encrypt, decrypt } from '../core/crypto'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5175'

let autoSyncEnabled = false
let focusHandler: (() => void) | null = null
let blurHandler: (() => void) | null = null
let unloadHandler: (() => void) | null = null

/**
 * Calculate SHA-256 checksum
 */
async function calculateChecksum(data: Uint8Array): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Upload user data to server
 */
export async function upload(data: UserData): Promise<void> {
  try {
    const key = await loadKey()
    if (!key) {
      throw new Error('Encryption key not found')
    }

    const encrypted = await encrypt(key, data)

    // Extract IV from encrypted blob (first 12 bytes)
    const encryptedBytes = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0))
    const iv = encryptedBytes.slice(0, 12)
    const ivBase64 = btoa(String.fromCharCode(...iv))

    // Calculate checksum of the ciphertext (without IV)
    const ciphertext = encryptedBytes.slice(12)
    const checksum = await calculateChecksum(ciphertext)

    const payload = {
      encryptedBlob: btoa(String.fromCharCode(...ciphertext)),
      iv: ivBase64,
      timestamp: data.timestamp,
      checksum
    }

    const response = await fetch(`${API_BASE}/api/sync/${data.userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`)
    }
  } catch (error) {
    console.error('Upload failed:', error)
    throw error
  }
}

/**
 * Download user data from server
 */
export async function download(): Promise<UserData | null> {
  try {
    const userId = await getUserId()
    if (!userId) {
      throw new Error('User ID not found')
    }

    const response = await fetch(`${API_BASE}/api/sync/${userId}`)

    if (response.status === 404) {
      // User not found on server (first sync)
      return null
    }

    if (!response.ok) {
      throw new Error(`Download failed: ${response.status}`)
    }

    const payload = await response.json()

    // Verify checksum
    const ciphertext = Uint8Array.from(atob(payload.encryptedBlob), c => c.charCodeAt(0))
    const calculatedChecksum = await calculateChecksum(ciphertext)

    if (calculatedChecksum !== payload.checksum) {
      throw new Error('Data integrity check failed - checksum mismatch')
    }

    // Reconstruct full encrypted blob (IV + ciphertext)
    const iv = Uint8Array.from(atob(payload.iv), c => c.charCodeAt(0))
    const combined = new Uint8Array(iv.length + ciphertext.length)
    combined.set(iv, 0)
    combined.set(ciphertext, iv.length)
    const encryptedBlob = btoa(String.fromCharCode(...combined))

    const key = await loadKey()
    if (!key) {
      throw new Error('Encryption key not found')
    }

    const data = await decrypt(key, encryptedBlob)
    return data
  } catch (error) {
    console.error('Download failed:', error)
    throw error
  }
}

/**
 * Sync: Smart merge with last-write-wins conflict resolution
 */
export async function sync(): Promise<void> {
  try {
    const local = await getData()
    const remote = await download()

    if (!remote) {
      // No remote data, upload local
      await upload(local)
      return
    }

    // Compare timestamps
    if (remote.timestamp > local.timestamp) {
      // Remote is newer, update local
      await setData(remote)
    } else {
      // Local is newer, upload
      await upload(local)
    }
  } catch (error) {
    console.warn('Sync failed, continuing offline:', error)
    // Don't throw - sync is optional
  }
}

/**
 * Enable automatic sync on window events
 */
export function enableAutoSync(): void {
  if (autoSyncEnabled) return

  focusHandler = () => {
    sync().catch(console.warn)
  }

  blurHandler = () => {
    getData().then(upload).catch(console.warn)
  }

  unloadHandler = () => {
    getData().then(upload).catch(console.warn)
  }

  window.addEventListener('focus', focusHandler)
  window.addEventListener('blur', blurHandler)
  window.addEventListener('beforeunload', unloadHandler)

  autoSyncEnabled = true
}

/**
 * Disable automatic sync
 */
export function disableAutoSync(): void {
  if (!autoSyncEnabled) return

  if (focusHandler) window.removeEventListener('focus', focusHandler)
  if (blurHandler) window.removeEventListener('blur', blurHandler)
  if (unloadHandler) window.removeEventListener('beforeunload', unloadHandler)

  focusHandler = null
  blurHandler = null
  unloadHandler = null
  autoSyncEnabled = false
}
