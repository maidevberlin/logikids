/**
 * Storage service for managing encryption keys and user data
 * Uses IndexedDB for persistent storage of encryption keys
 */

const DB_NAME = 'logikids_secure_storage'
const DB_VERSION = 1
const KEY_STORE = 'encryption_keys'
const USER_ID_KEY = 'userId'
const ENCRYPTION_KEY = 'encryptionKey'

class StorageService {
  private db: IDBDatabase | null = null

  /**
   * Initialize IndexedDB
   */
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create object store for keys
        if (!db.objectStoreNames.contains(KEY_STORE)) {
          db.createObjectStore(KEY_STORE)
        }
      }
    })
  }

  /**
   * Store encryption key
   */
  async storeKey(key: CryptoKey): Promise<void> {
    await this.ensureInit()

    // Export key to storable format
    const exported = await crypto.subtle.exportKey('raw', key)

    return this.setItem(ENCRYPTION_KEY, exported)
  }

  /**
   * Retrieve encryption key
   */
  async getKey(): Promise<CryptoKey | null> {
    await this.ensureInit()

    const exported = await this.getItem<ArrayBuffer>(ENCRYPTION_KEY)
    if (!exported) return null

    // Import key from stored format
    return crypto.subtle.importKey(
      'raw',
      exported,
      { name: 'AES-GCM' },
      true,
      ['encrypt', 'decrypt']
    )
  }

  /**
   * Store user ID
   */
  async storeUserId(userId: string): Promise<void> {
    await this.ensureInit()
    return this.setItem(USER_ID_KEY, userId)
  }

  /**
   * Retrieve user ID
   */
  async getUserId(): Promise<string | null> {
    await this.ensureInit()
    return this.getItem<string>(USER_ID_KEY)
  }

  /**
   * Clear all stored data (used on logout/delete account)
   */
  async clearAll(): Promise<void> {
    await this.ensureInit()

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction([KEY_STORE], 'readwrite')
      const store = transaction.objectStore(KEY_STORE)
      const request = store.clear()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  /**
   * Check if user is authenticated (has key and userId)
   */
  async isAuthenticated(): Promise<boolean> {
    await this.ensureInit()
    const [key, userId] = await Promise.all([
      this.getKey(),
      this.getUserId(),
    ])
    return key !== null && userId !== null
  }

  /**
   * Generic set item in IndexedDB
   */
  private async setItem(key: string, value: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction([KEY_STORE], 'readwrite')
      const store = transaction.objectStore(KEY_STORE)
      const request = store.put(value, key)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  /**
   * Generic get item from IndexedDB
   */
  private async getItem<T>(key: string): Promise<T | null> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction([KEY_STORE], 'readonly')
      const store = transaction.objectStore(KEY_STORE)
      const request = store.get(key)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || null)
    })
  }

  /**
   * Ensure database is initialized
   */
  private async ensureInit(): Promise<void> {
    if (!this.db) {
      await this.init()
    }
  }
}

// Export singleton instance
export const storageService = new StorageService()
