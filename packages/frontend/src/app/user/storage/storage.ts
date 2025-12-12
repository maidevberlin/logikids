import { createLogger } from '@/app/common/logger'

const logger = createLogger('IndexedDBStorage')
const DB_NAME = 'logikids_secure_storage'
const DB_VERSION = 2 // Incremented to force schema upgrade
const STORE_NAME = 'keys'
const KEY_ID = 'encryption_key'
const USER_ID_KEY = 'user_id'
const ACCESS_TOKEN_KEY = 'access_token'

/**
 * Opens IndexedDB connection with error recovery
 */
async function openDB(): Promise<IDBDatabase> {
  try {
    return await openDBInternal()
  } catch (error) {
    // If opening fails, try to delete and recreate
    logger.warn('IndexedDB open failed, attempting to recreate database', { error })
    try {
      await deleteDB()
      return await openDBInternal()
    } catch (retryError) {
      logger.error('Failed to recreate database', retryError as Error)
      throw retryError
    }
  }
}

/**
 * Delete the database
 */
async function deleteDB(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
    request.onblocked = () => {
      logger.warn('Database deletion blocked - will proceed anyway')
      resolve() // Resolve anyway
    }
  })
}

/**
 * Internal DB open logic
 */
async function openDBInternal(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const db = request.result
      // Verify store exists
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.close()
        reject(new Error(`Store ${STORE_NAME} not found - database needs upgrade`))
        return
      }
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      // Delete old store if it exists (clean slate)
      if (db.objectStoreNames.contains(STORE_NAME)) {
        db.deleteObjectStore(STORE_NAME)
      }
      // Create fresh store
      db.createObjectStore(STORE_NAME)
    }
  })
}

/**
 * Generic helper to wrap IDBRequest in a Promise
 */
function wrapRequest<T>(request: IDBRequest<T>, db: IDBDatabase, errorMessage: string): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onerror = () => {
      db.close()
      reject(request.error || new Error(errorMessage))
    }
    request.onsuccess = () => {
      db.close()
      resolve(request.result)
    }
  })
}

/**
 * Generic function to store a value in IndexedDB
 */
async function storeValue<T>(key: string, value: T): Promise<void> {
  const db = await openDB()
  const transaction = db.transaction([STORE_NAME], 'readwrite')
  const store = transaction.objectStore(STORE_NAME)
  const request = store.put(value, key)
  await wrapRequest(request, db, `Failed to store ${key}`)
}

/**
 * Generic function to retrieve a value from IndexedDB
 */
async function getValue<T>(key: string): Promise<T | null> {
  const db = await openDB()
  const transaction = db.transaction([STORE_NAME], 'readonly')
  const store = transaction.objectStore(STORE_NAME)
  const request = store.get(key)
  const result = await wrapRequest(request, db, `Failed to load ${key}`)
  return result || null
}

/**
 * Store encryption key in IndexedDB
 */
export const storeKey = (key: CryptoKey): Promise<void> => storeValue(KEY_ID, key)

/**
 * Load encryption key from IndexedDB
 */
export const loadKey = (): Promise<CryptoKey | null> => getValue<CryptoKey>(KEY_ID)

/**
 * Store userId in IndexedDB
 */
export const storeUserId = (userId: string): Promise<void> => storeValue(USER_ID_KEY, userId)

/**
 * Load userId from IndexedDB
 */
export const getUserId = (): Promise<string | null> => getValue<string>(USER_ID_KEY)

/**
 * Store access token in IndexedDB
 */
export const storeTokens = (accessToken: string): Promise<void> =>
  storeValue(ACCESS_TOKEN_KEY, accessToken)

/**
 * Get access token from IndexedDB
 */
export const getAccessToken = (): Promise<string | null> => getValue<string>(ACCESS_TOKEN_KEY)

/**
 * Clear all storage (for testing)
 */
export async function clearStorage(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME)
    request.onerror = () => reject(request.error || new Error('Failed to clear storage'))
    request.onsuccess = () => resolve()
    request.onblocked = () => {
      reject(new Error('Database deletion blocked - close all tabs using this database'))
    }
  })
}
