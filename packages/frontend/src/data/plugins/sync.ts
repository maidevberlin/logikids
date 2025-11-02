import { UserData } from '../core/types.ts'
import { getData, setData } from '../core/userData.ts'
import { loadKey, getUserId, getAccessToken } from '../core/storage.ts'
import { encrypt, decrypt } from '../core/crypto.ts'

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

    // Calculate checksum of the entire encrypted blob (IV + ciphertext)
    const ciphertext = encryptedBytes.slice(12)
    const checksum = await calculateChecksum(encryptedBytes)

    const payload = {
      encryptedBlob: btoa(String.fromCharCode(...ciphertext)),
      iv: ivBase64,
      timestamp: data.timestamp,
      checksum
    }

    const accessToken = await getAccessToken()
    if (!accessToken) {
      throw new Error('Access token not found')
    }

    const response = await fetch(`${API_BASE}/api/sync/${data.userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
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

    const accessToken = await getAccessToken()
    if (!accessToken) {
      throw new Error('Access token not found')
    }

    const response = await fetch(`${API_BASE}/api/sync/${userId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })

    if (response.status === 404) {
      // User not found on server (first sync)
      return null
    }

    if (!response.ok) {
      throw new Error(`Download failed: ${response.status}`)
    }

    const payload = await response.json()

    // Reconstruct full encrypted blob (IV + ciphertext) for checksum verification
    const iv = Uint8Array.from(atob(payload.iv), c => c.charCodeAt(0))
    const ciphertext = Uint8Array.from(atob(payload.encryptedBlob), c => c.charCodeAt(0))
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
      await upload(local)
      await setData({ lastSyncTimestamp: Date.now() })
      return
    }

    // Compare timestamps
    if (remote.timestamp > local.timestamp) {
      // Remote is newer, update local
      await setData({ ...remote, lastSyncTimestamp: Date.now() })
    } else {
      // Local is newer, upload
      await upload(local)
      await setData({ lastSyncTimestamp: Date.now() })
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
