import { loadKey, storeKey, storeUserId, getUserId } from '../core/storage.ts'
import { exportKey, importKey } from '../core/crypto.ts'
import { sync } from './sync.ts'

export interface QRPayload {
  userId: string
  key: string // JWK as JSON string
  timestamp: number
}

/**
 * Generate QR code data for device pairing
 */
export async function generateQRData(): Promise<QRPayload> {
  const key = await loadKey()
  if (!key) {
    throw new Error('Encryption key not found')
  }

  const userId = await getUserId()
  if (!userId) {
    throw new Error('User ID not found')
  }

  const exportedKey = await exportKey(key)

  return {
    userId,
    key: JSON.stringify(exportedKey),
    timestamp: Date.now()
  }
}

/**
 * Import QR code data from another device
 */
export async function importQRData(payload: QRPayload): Promise<void> {
  // Import the encryption key
  const keyJwk = JSON.parse(payload.key)
  const key = await importKey(keyJwk)

  // Store key and userId
  await storeKey(key)
  await storeUserId(payload.userId)

  // Sync data from server - this will download encrypted data and restore it locally
  try {
    await sync()
  } catch (error) {
    console.error('Sync after import failed:', error)
    // If sync fails, at least we have the key/userId stored
    // User can try syncing again later
  }

  // Trigger data refresh event so UI updates
  window.dispatchEvent(new Event('data-changed'))
}
