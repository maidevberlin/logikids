const DB_NAME = 'logikids_secure_storage'
const DB_VERSION = 2 // Incremented to force schema upgrade
const STORE_NAME = 'keys'
const KEY_ID = 'encryption_key'
const USER_ID_KEY = 'user_id'
const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const JWT_TOKEN_KEY = 'jwt_token' // Legacy - for backwards compatibility

/**
 * Opens IndexedDB connection with error recovery
 */
async function openDB(): Promise<IDBDatabase> {
  try {
    return await openDBInternal()
  } catch (error) {
    // If opening fails, try to delete and recreate
    console.warn('IndexedDB open failed, attempting to recreate database:', error)
    try {
      await deleteDB()
      return await openDBInternal()
    } catch (retryError) {
      console.error('Failed to recreate database:', retryError)
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
      console.warn('Database deletion blocked - will proceed anyway')
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
 * Store encryption key in IndexedDB
 */
export async function storeKey(key: CryptoKey): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.put(key, KEY_ID)

    request.onerror = () => {
      db.close()
      reject(request.error || new Error('Failed to store key'))
    }
    request.onsuccess = () => {
      db.close()
      resolve()
    }
  })
}

/**
 * Load encryption key from IndexedDB
 */
export async function loadKey(): Promise<CryptoKey | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.get(KEY_ID)

    request.onerror = () => {
      db.close()
      reject(request.error || new Error('Failed to load key'))
    }
    request.onsuccess = () => {
      db.close()
      resolve(request.result || null)
    }
  })
}

/**
 * Store userId in IndexedDB
 */
export async function storeUserId(userId: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.put(userId, USER_ID_KEY)

    request.onerror = () => {
      db.close()
      reject(request.error || new Error('Failed to store userId'))
    }
    request.onsuccess = () => {
      db.close()
      resolve()
    }
  })
}

/**
 * Load userId from IndexedDB
 */
export async function getUserId(): Promise<string | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.get(USER_ID_KEY)

    request.onerror = () => {
      db.close()
      reject(request.error || new Error('Failed to load userId'))
    }
    request.onsuccess = () => {
      db.close()
      resolve(request.result || null)
    }
  })
}

/**
 * Store access token in IndexedDB
 */
export async function storeTokens(accessToken: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.put(accessToken, ACCESS_TOKEN_KEY)

    request.onerror = () => {
      db.close()
      reject(request.error || new Error('Failed to store access token'))
    }
    request.onsuccess = () => {
      db.close()
      resolve()
    }
  })
}

/**
 * Get access token from IndexedDB
 */
export async function getAccessToken(): Promise<string | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.get(ACCESS_TOKEN_KEY)

    request.onerror = () => {
      db.close()
      reject(request.error || new Error('Failed to load access token'))
    }
    request.onsuccess = () => {
      db.close()
      resolve(request.result || null)
    }
  })
}

/**
 * Get refresh token from IndexedDB
 */
export async function getRefreshToken(): Promise<string | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.get(REFRESH_TOKEN_KEY)

    request.onerror = () => {
      db.close()
      reject(request.error || new Error('Failed to load refresh token'))
    }
    request.onsuccess = () => {
      db.close()
      resolve(request.result || null)
    }
  })
}

/**
 * Store JWT token in IndexedDB (legacy - for backwards compatibility)
 * @deprecated Use storeTokens instead
 */
export async function storeToken(token: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.put(token, JWT_TOKEN_KEY)

    request.onerror = () => {
      db.close()
      reject(request.error || new Error('Failed to store token'))
    }
    request.onsuccess = () => {
      db.close()
      resolve()
    }
  })
}

/**
 * Load JWT token from IndexedDB
 * Returns access token if available, otherwise legacy token
 */
export async function getToken(): Promise<string | null> {
  // Try access token first
  const accessToken = await getAccessToken()
  if (accessToken) return accessToken

  // Fallback to legacy token
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.get(JWT_TOKEN_KEY)

    request.onerror = () => {
      db.close()
      reject(request.error || new Error('Failed to load token'))
    }
    request.onsuccess = () => {
      db.close()
      resolve(request.result || null)
    }
  })
}

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
