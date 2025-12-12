import { loadKey, storeKey, storeUserId, getUserId, exportKey, importKey } from '@/app/user/storage'

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
 * Generate a backup code string from QR payload
 * Format: base64(userId:keyJson), split with dashes for readability
 */
export function generateBackupCode(payload: QRPayload): string {
  const raw = `${payload.userId}:${payload.key}`
  const base64 = btoa(raw)
  // Split into groups of 4 for readability
  return base64.match(/.{1,4}/g)?.join('-') || base64
}

/**
 * Generate a full URL for QR code scanning
 * When scanned, opens the app and attempts to log in
 */
export async function generateQRUrl(): Promise<string> {
  const payload = await generateQRData()
  const backupCode = generateBackupCode(payload)
  // Use current origin with hash router
  const baseUrl = window.location.origin + window.location.pathname
  return `${baseUrl}#/pair?code=${encodeURIComponent(backupCode)}`
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
