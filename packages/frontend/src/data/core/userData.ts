import { UserData, UserSettings } from './types.ts'
import { getUserId, loadKey } from './storage.ts'
import { decrypt, encrypt } from './crypto.ts'
import { GameStats } from '@/app/stats/gameTypes'
import { createLogger } from '@/lib/logger'

const logger = createLogger('UserData')
const STORAGE_KEY = 'logikids_data'

/**
 * Remove old localStorage keys from previous implementation
 */
function cleanupLegacyStorage(): void {
  const legacyKeys = ['logikids_progress', 'logikids_user_profile', 'logikids_last_task']

  legacyKeys.forEach((key) => {
    if (localStorage.getItem(key)) {
      logger.debug('Cleaning up legacy storage key', { key })
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
    logger.error('Failed to initialize user data', error as Error)
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

    return await decrypt(key, encrypted)
  } catch (error) {
    logger.error('Failed to load user data', error as Error)
    // Return null instead of creating new data
    return null
  }
}

/**
 * Update user data (merges with existing)
 * Throws error if no user data exists
 *
 * @param updates - Partial data to merge
 * @param currentData - Optional pre-loaded data to avoid redundant read
 * @returns The merged UserData that was saved
 */
export async function setData(
  updates: Partial<UserData>,
  currentData?: UserData
): Promise<UserData> {
  try {
    const current = currentData ?? (await getData())
    if (!current) {
      throw new Error('Cannot update data: no user exists. Call createNewUser() first.')
    }

    const merged: UserData = {
      ...current,
      ...updates,
      timestamp: Date.now(),
    }

    const key = await loadKey()
    if (!key) {
      throw new Error('Encryption key not found')
    }

    const encrypted = await encrypt(key, merged)
    localStorage.setItem(STORAGE_KEY, encrypted)

    // Dispatch event for React reactivity
    window.dispatchEvent(new Event('data-changed'))

    return merged
  } catch (error) {
    logger.error('Failed to save user data', error as Error)
    throw error
  }
}

/**
 * Update only settings (convenience method)
 */
export async function updateSettings(settings: Partial<UserSettings>): Promise<UserData> {
  const current = await getData()
  if (!current) {
    throw new Error('Cannot update settings: no user exists')
  }
  return setData(
    {
      settings: {
        ...current.settings,
        ...settings,
      },
    },
    current
  )
}

/**
 * Update only progress (convenience method with deep merge)
 */
export async function updateProgress(progress: Record<string, any>): Promise<UserData> {
  const current = await getData()
  if (!current) {
    throw new Error('Cannot update progress: no user exists')
  }
  return setData(
    {
      progress: deepMerge(current.progress, progress),
    },
    current
  )
}

/**
 * Update only gameStats (convenience method)
 */
export async function updateGameStats(gameStats: GameStats): Promise<UserData> {
  const current = await getData()
  if (!current) {
    throw new Error('Cannot update game stats: no user exists')
  }
  return setData(
    {
      gameStats: gameStats,
    },
    current
  )
}

/**
 * Update progress and gameStats together (single read, single write)
 */
export async function updateProgressAndGameStats(
  progress: Record<string, any>,
  gameStats: GameStats
): Promise<UserData> {
  const current = await getData()
  if (!current) {
    throw new Error('Cannot update data: no user exists')
  }
  return setData(
    {
      progress: deepMerge(current.progress, progress),
      gameStats: gameStats,
    },
    current
  )
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
