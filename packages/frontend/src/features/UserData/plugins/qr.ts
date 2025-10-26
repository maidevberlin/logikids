import { loadKey, storeKey, storeUserId, getUserId } from '../core/storage'
import { exportKey, importKey } from '../core/crypto'
import { sync } from './sync'

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

  // Sync data from server
  await sync()
}
