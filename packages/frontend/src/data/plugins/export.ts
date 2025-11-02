import { UserData } from '../core/types.ts'
import { getData, loginWithAccount } from '../core/userData.ts'
import { storeKey, storeUserId, loadKey } from '../core/storage.ts'
import { importKey, encrypt, exportKey } from '../core/crypto.ts'

const STORAGE_KEY = 'logikids_data'

/**
 * Export user data as unencrypted JSON string
 * Includes encryption key so data can be imported on another device
 */
export async function exportData(): Promise<string> {
  const data = await getData()
  const key = await loadKey()

  if (!key) {
    throw new Error('No encryption key found')
  }

  // Export key to JWK format
  const keyJwk = await exportKey(key)

  // Include key in export
  const exportData = {
    ...data,
    encryptionKey: JSON.stringify(keyJwk)
  }

  return JSON.stringify(exportData, null, 2)
}

/**
 * Import user data from JSON string
 * Merges progress additively (never loses data)
 * Also logs in with the backend using the imported userId
 */
export async function importData(json: string): Promise<void> {
  const imported: UserData = JSON.parse(json)

  // Import must include encryption key
  if (!imported.encryptionKey) {
    throw new Error('Import data missing encryption key')
  }

  // Import the encryption key
  const keyJwk = JSON.parse(imported.encryptionKey)
  const key = await importKey(keyJwk)

  // Store key and userId in IndexedDB
  await storeKey(key)
  await storeUserId(imported.userId)

  const current = await getData()

  // Merge progress additively if there's existing data
  const mergedProgress = current
    ? mergeProgress(current.progress, imported.progress)
    : imported.progress

  const merged: UserData = {
    ...imported,
    progress: mergedProgress,
    timestamp: Date.now()
  }

  // Encrypt and store the data directly
  const encrypted = await encrypt(key, merged)
  localStorage.setItem(STORAGE_KEY, encrypted)

  // Login with backend to get JWT tokens
  await loginWithAccount(imported.userId)

  // Trigger data refresh event so UI updates
  window.dispatchEvent(new Event('data-changed'))
}

/**
 * Deep merge progress, keeping all data from both sources
 */
function mergeProgress(
  current: Record<string, any>,
  imported: Record<string, any>
): Record<string, any> {
  const result = { ...current }

  for (const key in imported) {
    if (imported[key] && typeof imported[key] === 'object' && !Array.isArray(imported[key])) {
      result[key] = mergeProgress(result[key] || {}, imported[key])
    } else {
      // Prefer imported value if it exists
      result[key] = imported[key]
    }
  }

  return result
}
