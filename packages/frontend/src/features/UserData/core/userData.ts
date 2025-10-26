import { UserData, UserSettings, createDefaultUserData } from './types'
import { loadKey, storeKey, getUserId, storeUserId } from './storage'
import { generateKey, encrypt, decrypt } from './crypto'

const STORAGE_KEY = 'logikids_data'

/**
 * Initialize user data (called once on app start)
 */
export async function initialize(): Promise<UserData> {
  try {
    // Check if we already have data
    const existingUserId = await getUserId()
    const existingData = localStorage.getItem(STORAGE_KEY)

    if (existingUserId && existingData) {
      // Already initialized
      return await getData()
    }

    // First time: generate key and userId
    const key = await generateKey()
    const userId = crypto.randomUUID()

    await storeKey(key)
    await storeUserId(userId)

    // Create default data
    const defaultData = createDefaultUserData(userId)

    // Store it encrypted
    const encrypted = await encrypt(key, defaultData)
    localStorage.setItem(STORAGE_KEY, encrypted)

    return defaultData
  } catch (error) {
    console.error('Failed to initialize user data:', error)
    throw error
  }
}

/**
 * Get current user data (decrypted)
 */
export async function getData(): Promise<UserData> {
  try {
    const encrypted = localStorage.getItem(STORAGE_KEY)
    if (!encrypted) {
      // No data exists, initialize
      return await initialize()
    }

    const key = await loadKey()
    if (!key) {
      throw new Error('Encryption key not found')
    }

    const data = await decrypt(key, encrypted)
    return data
  } catch (error) {
    console.error('Failed to load user data, resetting:', error)

    // Data corrupted, create fresh
    const userId = await getUserId() || crypto.randomUUID()
    const defaultData = createDefaultUserData(userId)

    // Try to save it
    try {
      await setData(defaultData)
    } catch {
      // If save also fails, just return default
    }

    return defaultData
  }
}

/**
 * Update user data (merges with existing)
 */
export async function setData(updates: Partial<UserData>): Promise<void> {
  try {
    const current = await getData()
    const merged: UserData = {
      ...current,
      ...updates,
      timestamp: Date.now()
    }

    const key = await loadKey()
    if (!key) {
      throw new Error('Encryption key not found')
    }

    const encrypted = await encrypt(key, merged)
    localStorage.setItem(STORAGE_KEY, encrypted)

    // Dispatch event for React reactivity
    window.dispatchEvent(new Event('data-changed'))
  } catch (error) {
    console.error('Failed to save user data:', error)
    throw error
  }
}

/**
 * Update only settings (convenience method)
 */
export async function updateSettings(settings: Partial<UserSettings>): Promise<void> {
  const current = await getData()
  await setData({
    settings: {
      ...current.settings,
      ...settings
    }
  })
}

/**
 * Update only progress (convenience method with deep merge)
 */
export async function updateProgress(progress: Record<string, any>): Promise<void> {
  const current = await getData()
  await setData({
    progress: deepMerge(current.progress, progress)
  })
}

/**
 * Deep merge helper for nested objects
 */
function deepMerge(target: Record<string, any>, source: Record<string, any>): Record<string, any> {
  const result = { ...target }

  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key])
    } else {
      result[key] = source[key]
    }
  }

  return result
}
