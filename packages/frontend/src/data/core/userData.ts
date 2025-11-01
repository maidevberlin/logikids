import { UserData, UserSettings, createDefaultUserData } from './types.ts'
import { loadKey, storeKey, getUserId, storeUserId } from './storage.ts'
import { generateKey, encrypt, decrypt } from './crypto.ts'

const STORAGE_KEY = 'logikids_data'

/**
 * Remove old localStorage keys from previous implementation
 */
function cleanupLegacyStorage(): void {
  const legacyKeys = [
    'logikids_progress',
    'logikids_user_profile',
    'logikids_last_task'
  ]

  legacyKeys.forEach(key => {
    if (localStorage.getItem(key)) {
      console.log(`Cleaning up legacy storage key: ${key}`)
      localStorage.removeItem(key)
    }
  })
}

/**
 * Initialize user data (called once on app start)
 * Returns null if no data exists (brand new user)
 */
export async function initialize(): Promise<UserData | null> {
  try {
    // Check if we already have data
    const existingUserId = await getUserId()
    const existingData = localStorage.getItem(STORAGE_KEY)

    if (existingUserId && existingData) {
      // Already initialized - clean up old keys if they exist
      cleanupLegacyStorage()
      return await getData()
    }

    // No data exists - return null for brand new users
    // Data will be created later after invite code validation
    return null
  } catch (error) {
    console.error('Failed to initialize user data:', error)
    throw error
  }
}

/**
 * Create a new user (called after invite code validation)
 */
export async function createNewUser(): Promise<UserData> {
  try {
    // Generate key and userId
    const key = await generateKey()
    const userId = crypto.randomUUID()

    await storeKey(key)
    await storeUserId(userId)

    // Create default data
    const defaultData = createDefaultUserData(userId)

    // Store it encrypted
    const encrypted = await encrypt(key, defaultData)
    localStorage.setItem(STORAGE_KEY, encrypted)

    // Clean up any legacy storage
    cleanupLegacyStorage()

    // Dispatch event for React reactivity
    window.dispatchEvent(new Event('data-changed'))

    return defaultData
  } catch (error) {
    console.error('Failed to create new user:', error)
    throw error
  }
}

/**
 * Get current user data (decrypted)
 * Returns null if no data exists
 */
export async function getData(): Promise<UserData | null> {
  try {
    const encrypted = localStorage.getItem(STORAGE_KEY)
    if (!encrypted) {
      // No data exists
      return null
    }

    const key = await loadKey()
    if (!key) {
      throw new Error('Encryption key not found')
    }

    const data = await decrypt(key, encrypted)
    return data
  } catch (error) {
    console.error('Failed to load user data:', error)
    // Return null instead of creating new data
    return null
  }
}

/**
 * Update user data (merges with existing)
 * Throws error if no user data exists
 */
export async function setData(updates: Partial<UserData>): Promise<void> {
  try {
    const current = await getData()
    if (!current) {
      throw new Error('Cannot update data: no user exists. Call createNewUser() first.')
    }

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
  if (!current) {
    throw new Error('Cannot update settings: no user exists')
  }
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
  if (!current) {
    throw new Error('Cannot update progress: no user exists')
  }
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
