import { loadKey, storeKey, storeUserId, getUserId } from '../core/storage.ts'
import { exportKey, importKey } from '../core/crypto.ts'

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
    timestamp: Date.now(),
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
    timestamp: Date.now(),
  }
}

/**
 * Prepare key and userId from QR payload for import
 * Call this before calling auth.login() and sync()
 */
export async function prepareImportData(payload: QRPayload): Promise<void> {
  // Import the encryption key
  const keyJwk = JSON.parse(payload.key)
  const key = await importKey(keyJwk)

  // Store key and userId in IndexedDB
  await storeKey(key)
  await storeUserId(payload.userId)
}
