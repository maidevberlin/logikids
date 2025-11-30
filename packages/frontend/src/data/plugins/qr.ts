import { loadKey, storeKey, storeUserId, getUserId } from '../core/storage.ts'
import { exportKey, importKey } from '../core/crypto.ts'
import { sync } from './sync.ts'
import { loginWithAccount } from '../core/userData.ts'
import { createLogger } from '@/lib/logger'

const logger = createLogger('QRPlugin')

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
 * Parse a backup code string into a QRPayload
 * Backup codes are base64-encoded strings containing userId:keyJson
 */
export function parseBackupCode(code: string): QRPayload {
  // Remove dashes and whitespace
  const base64 = code.replace(/[-\s]/g, '')

  // Decode base64
  let decoded: string
  try {
    decoded = atob(base64)
  } catch {
    throw new Error('Invalid backup code: not valid base64')
  }

  // Split on first colon only
  const colonIndex = decoded.indexOf(':')
  if (colonIndex === -1) {
    throw new Error('Invalid backup code format: missing separator')
  }

  const userId = decoded.substring(0, colonIndex)
  const keyJson = decoded.substring(colonIndex + 1)

  if (!userId || !keyJson) {
    throw new Error('Invalid backup code format')
  }

  // Validate JSON
  try {
    JSON.parse(keyJson)
  } catch {
    throw new Error('Backup code appears to be corrupted or incomplete')
  }

  return {
    userId,
    key: keyJson,
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

  // Login with backend to get JWT tokens
  await loginWithAccount(payload.userId)

  // Sync data from server - this will download encrypted data and restore it locally
  try {
    await sync()
  } catch (error) {
    logger.error('Sync after import failed', error as Error)
    // If sync fails, at least we have the key/userId stored
    // User can try syncing again later
  }

  // Trigger data refresh event so UI updates
  window.dispatchEvent(new Event('data-changed'))
}
