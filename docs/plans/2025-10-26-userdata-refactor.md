# UserData Refactor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace complex data handling with simple, atomic, plugin-based architecture

**Architecture:** Core module (types, storage, crypto, CRUD) + optional plugins (sync, export, QR) + thin React context wrapper. Single source of truth, always encrypted, no dual paths.

**Tech Stack:** TypeScript, React, Web Crypto API, IndexedDB, localStorage

---

## Task 1: Core Types and Storage Abstraction

**Files:**
- Create: `packages/frontend/src/features/UserData/core/types.ts`
- Create: `packages/frontend/src/features/UserData/core/storage.ts`
- Create: `packages/frontend/src/features/UserData/__tests__/storage.test.ts`

**Step 1: Create directory structure**

```bash
mkdir -p packages/frontend/src/features/UserData/core
mkdir -p packages/frontend/src/features/UserData/__tests__
```

**Step 2: Write types file**

Create `packages/frontend/src/features/UserData/core/types.ts`:

```typescript
export interface UserSettings {
  name: string
  age: number
  language: string
  gender: string
}

export interface LastTask {
  subject: string
  concept: string
}

export interface UserData {
  userId: string
  settings: UserSettings
  progress: Record<string, any>
  lastTask: LastTask
  timestamp: number
}

export const DEFAULT_SETTINGS: UserSettings = {
  name: '',
  age: 10,
  language: 'en',
  gender: 'neutral'
}

export const DEFAULT_LAST_TASK: LastTask = {
  subject: '',
  concept: ''
}

export function createDefaultUserData(userId: string): UserData {
  return {
    userId,
    settings: { ...DEFAULT_SETTINGS },
    progress: {},
    lastTask: { ...DEFAULT_LAST_TASK },
    timestamp: Date.now()
  }
}
```

**Step 3: Write failing test for storage**

Create `packages/frontend/src/features/UserData/__tests__/storage.test.ts`:

```typescript
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import { storeKey, loadKey, getUserId, storeUserId, clearStorage } from '../core/storage'

describe('Storage', () => {
  beforeEach(async () => {
    await clearStorage()
  })

  afterEach(async () => {
    await clearStorage()
  })

  describe('CryptoKey storage', () => {
    it('should store and retrieve a crypto key', async () => {
      // Generate a test key
      const key = await crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      )

      // Store it
      await storeKey(key)

      // Retrieve it
      const retrieved = await loadKey()

      expect(retrieved).toBeDefined()
      expect(retrieved?.type).toBe('secret')
    })

    it('should return null if no key exists', async () => {
      const key = await loadKey()
      expect(key).toBeNull()
    })
  })

  describe('UserId storage', () => {
    it('should store and retrieve userId', async () => {
      const userId = 'test-user-id'

      await storeUserId(userId)
      const retrieved = await getUserId()

      expect(retrieved).toBe(userId)
    })

    it('should return null if no userId exists', async () => {
      const userId = await getUserId()
      expect(userId).toBeNull()
    })
  })
})
```

**Step 4: Run test to verify it fails**

```bash
cd packages/frontend
npm test -- storage.test.ts
```

Expected: FAIL - module not found

**Step 5: Write storage implementation**

Create `packages/frontend/src/features/UserData/core/storage.ts`:

```typescript
const DB_NAME = 'logikids_secure_storage'
const DB_VERSION = 1
const STORE_NAME = 'keys'
const KEY_ID = 'encryption_key'
const USER_ID_KEY = 'user_id'

/**
 * Opens IndexedDB connection
 */
async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
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

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
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

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result || null)
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

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
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

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result || null)
  })
}

/**
 * Clear all storage (for testing)
 */
export async function clearStorage(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}
```

**Step 6: Run tests to verify they pass**

```bash
cd packages/frontend
npm test -- storage.test.ts
```

Expected: PASS (all tests)

**Step 7: Commit**

```bash
git add packages/frontend/src/features/UserData/
git commit -m "feat: add UserData core types and storage abstraction

- Add UserData, UserSettings, LastTask types
- Implement IndexedDB storage for CryptoKey and userId
- Add comprehensive storage tests

Part of UserData refactor.
"
```

---

## Task 2: Crypto Primitives

**Files:**
- Create: `packages/frontend/src/features/UserData/core/crypto.ts`
- Create: `packages/frontend/src/features/UserData/__tests__/crypto.test.ts`

**Step 1: Write failing test for crypto operations**

Create `packages/frontend/src/features/UserData/__tests__/crypto.test.ts`:

```typescript
import { describe, it, expect } from '@jest/globals'
import { generateKey, encrypt, decrypt, exportKey, importKey } from '../core/crypto'

describe('Crypto', () => {
  describe('Key generation', () => {
    it('should generate a valid AES-256-GCM key', async () => {
      const key = await generateKey()

      expect(key.type).toBe('secret')
      expect(key.algorithm.name).toBe('AES-GCM')
      expect((key.algorithm as any).length).toBe(256)
    })
  })

  describe('Encryption/Decryption', () => {
    it('should encrypt and decrypt data correctly', async () => {
      const key = await generateKey()
      const testData = { message: 'Hello, World!', number: 42 }

      const encrypted = await encrypt(key, testData)
      const decrypted = await decrypt(key, encrypted)

      expect(decrypted).toEqual(testData)
    })

    it('should produce different ciphertext for same data (due to random IV)', async () => {
      const key = await generateKey()
      const testData = { message: 'test' }

      const encrypted1 = await encrypt(key, testData)
      const encrypted2 = await encrypt(key, testData)

      expect(encrypted1).not.toBe(encrypted2)
    })

    it('should fail to decrypt with wrong key', async () => {
      const key1 = await generateKey()
      const key2 = await generateKey()
      const testData = { message: 'secret' }

      const encrypted = await encrypt(key1, testData)

      await expect(decrypt(key2, encrypted)).rejects.toThrow()
    })
  })

  describe('Key export/import', () => {
    it('should export and import a key', async () => {
      const originalKey = await generateKey()
      const testData = { test: 'data' }

      // Encrypt with original key
      const encrypted = await encrypt(originalKey, testData)

      // Export and import key
      const exported = await exportKey(originalKey)
      const imported = await importKey(exported)

      // Decrypt with imported key
      const decrypted = await decrypt(imported, encrypted)

      expect(decrypted).toEqual(testData)
    })
  })
})
```

**Step 2: Run test to verify it fails**

```bash
cd packages/frontend
npm test -- crypto.test.ts
```

Expected: FAIL - module not found

**Step 3: Write crypto implementation**

Create `packages/frontend/src/features/UserData/core/crypto.ts`:

```typescript
const ALGORITHM = 'AES-GCM'
const KEY_LENGTH = 256
const IV_LENGTH = 12 // 96 bits recommended for AES-GCM

/**
 * Generate a new AES-256-GCM encryption key
 */
export async function generateKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(
    { name: ALGORITHM, length: KEY_LENGTH },
    true, // extractable
    ['encrypt', 'decrypt']
  )
}

/**
 * Encrypt data with the given key
 */
export async function encrypt(key: CryptoKey, data: any): Promise<string> {
  // Generate random IV
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH))

  // Convert data to JSON then to bytes
  const encoder = new TextEncoder()
  const dataBytes = encoder.encode(JSON.stringify(data))

  // Encrypt
  const encryptedData = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    dataBytes
  )

  // Combine IV + encrypted data
  const combined = new Uint8Array(iv.length + encryptedData.byteLength)
  combined.set(iv, 0)
  combined.set(new Uint8Array(encryptedData), iv.length)

  // Convert to base64
  return btoa(String.fromCharCode(...combined))
}

/**
 * Decrypt data with the given key
 */
export async function decrypt(key: CryptoKey, encryptedString: string): Promise<any> {
  // Decode base64
  const combined = Uint8Array.from(atob(encryptedString), c => c.charCodeAt(0))

  // Extract IV and encrypted data
  const iv = combined.slice(0, IV_LENGTH)
  const encryptedData = combined.slice(IV_LENGTH)

  // Decrypt
  const decryptedData = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv },
    key,
    encryptedData
  )

  // Convert bytes to JSON
  const decoder = new TextDecoder()
  const jsonString = decoder.decode(decryptedData)

  return JSON.parse(jsonString)
}

/**
 * Export key to JWK format for storage/transfer
 */
export async function exportKey(key: CryptoKey): Promise<JsonWebKey> {
  return crypto.subtle.exportKey('jwk', key)
}

/**
 * Import key from JWK format
 */
export async function importKey(jwk: JsonWebKey): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: ALGORITHM, length: KEY_LENGTH },
    true,
    ['encrypt', 'decrypt']
  )
}
```

**Step 4: Run tests to verify they pass**

```bash
cd packages/frontend
npm test -- crypto.test.ts
```

Expected: PASS (all tests)

**Step 5: Commit**

```bash
git add packages/frontend/src/features/UserData/
git commit -m "feat: add crypto primitives for UserData

- Implement AES-256-GCM encryption/decryption
- Add key generation, export, and import
- Use random IV for each encryption operation
- Add comprehensive crypto tests

Part of UserData refactor.
"
```

---

## Task 3: Core UserData Operations

**Files:**
- Create: `packages/frontend/src/features/UserData/core/userData.ts`
- Create: `packages/frontend/src/features/UserData/__tests__/userData.test.ts`

**Step 1: Write failing test for userData operations**

Create `packages/frontend/src/features/UserData/__tests__/userData.test.ts`:

```typescript
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import { initialize, getData, setData, updateSettings, updateProgress } from '../core/userData'
import { clearStorage } from '../core/storage'

describe('UserData operations', () => {
  beforeEach(async () => {
    // Clear storage and localStorage
    await clearStorage()
    localStorage.clear()
  })

  afterEach(async () => {
    await clearStorage()
    localStorage.clear()
  })

  describe('initialize', () => {
    it('should create new user data on first call', async () => {
      const data = await initialize()

      expect(data.userId).toBeDefined()
      expect(data.userId).toMatch(/^[0-9a-f-]{36}$/) // UUID format
      expect(data.settings.name).toBe('')
      expect(data.settings.age).toBe(10)
      expect(data.settings.language).toBe('en')
      expect(data.progress).toEqual({})
    })

    it('should return existing data on subsequent calls', async () => {
      const data1 = await initialize()
      const data2 = await initialize()

      expect(data2.userId).toBe(data1.userId)
    })

    it('should store encrypted data in localStorage', async () => {
      await initialize()

      const stored = localStorage.getItem('logikids_data')
      expect(stored).toBeDefined()
      expect(stored).not.toContain('userId') // Should be encrypted
    })
  })

  describe('getData', () => {
    it('should retrieve decrypted user data', async () => {
      await initialize()
      const data = await getData()

      expect(data.userId).toBeDefined()
      expect(data.settings).toBeDefined()
    })

    it('should return default data if storage is corrupted', async () => {
      await initialize()
      localStorage.setItem('logikids_data', 'corrupted-data')

      const data = await getData()
      expect(data).toBeDefined()
      expect(data.userId).toBeDefined()
    })
  })

  describe('setData', () => {
    it('should merge updates with existing data', async () => {
      await initialize()

      await setData({ settings: { name: 'Alice', age: 12, language: 'en', gender: 'female' } })
      const data = await getData()

      expect(data.settings.name).toBe('Alice')
      expect(data.settings.age).toBe(12)
    })

    it('should update timestamp', async () => {
      const initial = await initialize()

      // Wait a tiny bit to ensure timestamp changes
      await new Promise(resolve => setTimeout(resolve, 10))

      await setData({ settings: { ...initial.settings, name: 'Bob' } })
      const updated = await getData()

      expect(updated.timestamp).toBeGreaterThan(initial.timestamp)
    })

    it('should dispatch data-changed event', async () => {
      await initialize()

      let eventFired = false
      const handler = () => { eventFired = true }
      window.addEventListener('data-changed', handler)

      await setData({ settings: { name: 'Charlie', age: 10, language: 'en', gender: 'male' } })

      expect(eventFired).toBe(true)
      window.removeEventListener('data-changed', handler)
    })
  })

  describe('updateSettings', () => {
    it('should update only specified settings fields', async () => {
      await initialize()

      await updateSettings({ name: 'Alice' })
      const data = await getData()

      expect(data.settings.name).toBe('Alice')
      expect(data.settings.age).toBe(10) // Unchanged
      expect(data.settings.language).toBe('en') // Unchanged
    })
  })

  describe('updateProgress', () => {
    it('should merge progress data', async () => {
      await initialize()

      await updateProgress({ math: { easy: { correct: 5, wrong: 2 } } })
      const data1 = await getData()
      expect(data1.progress.math.easy.correct).toBe(5)

      await updateProgress({ math: { medium: { correct: 3, wrong: 1 } } })
      const data2 = await getData()
      expect(data2.progress.math.easy.correct).toBe(5) // Still there
      expect(data2.progress.math.medium.correct).toBe(3) // Added
    })
  })
})
```

**Step 2: Run test to verify it fails**

```bash
cd packages/frontend
npm test -- userData.test.ts
```

Expected: FAIL - module not found

**Step 3: Write userData implementation**

Create `packages/frontend/src/features/UserData/core/userData.ts`:

```typescript
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
```

**Step 4: Run tests to verify they pass**

```bash
cd packages/frontend
npm test -- userData.test.ts
```

Expected: PASS (all tests)

**Step 5: Commit**

```bash
git add packages/frontend/src/features/UserData/
git commit -m "feat: add core UserData CRUD operations

- Implement initialize, getData, setData operations
- Add convenience methods: updateSettings, updateProgress
- Handle corruption gracefully (reset to defaults)
- Dispatch data-changed events for React
- Add comprehensive userData tests

Part of UserData refactor.
"
```

---

## Task 4: Sync Plugin

**Files:**
- Create: `packages/frontend/src/features/UserData/plugins/sync.ts`
- Create: `packages/frontend/src/features/UserData/__tests__/sync.test.ts`

**Step 1: Write failing test for sync plugin**

Create `packages/frontend/src/features/UserData/__tests__/sync.test.ts`:

```typescript
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals'
import { upload, download, sync, enableAutoSync, disableAutoSync } from '../plugins/sync'
import { initialize, setData, getData } from '../core/userData'
import { clearStorage } from '../core/storage'

// Mock fetch
global.fetch = jest.fn() as any

describe('Sync Plugin', () => {
  beforeEach(async () => {
    await clearStorage()
    localStorage.clear()
    ;(fetch as any).mockClear()
  })

  afterEach(async () => {
    await clearStorage()
    localStorage.clear()
    disableAutoSync()
  })

  describe('upload', () => {
    it('should upload encrypted data to server', async () => {
      const data = await initialize()

      ;(fetch as any).mockResolvedValueOnce({ ok: true })

      await upload(data)

      expect(fetch).toHaveBeenCalledWith(
        `http://localhost:5175/api/sync/${data.userId}`,
        expect.objectContaining({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
        })
      )
    })

    it('should throw on network error', async () => {
      const data = await initialize()

      ;(fetch as any).mockRejectedValueOnce(new Error('Network error'))

      await expect(upload(data)).rejects.toThrow('Network error')
    })
  })

  describe('download', () => {
    it('should download and decrypt data from server', async () => {
      const data = await initialize()

      const serverResponse = {
        encryptedBlob: await require('../core/crypto').encrypt(
          await require('../core/storage').loadKey(),
          data
        )
      }

      ;(fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => serverResponse
      })

      const downloaded = await download()

      expect(downloaded?.userId).toBe(data.userId)
    })

    it('should return null if user not found on server', async () => {
      await initialize()

      ;(fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404
      })

      const result = await download()
      expect(result).toBeNull()
    })
  })

  describe('sync', () => {
    it('should upload local data if server has none', async () => {
      const data = await initialize()

      ;(fetch as any)
        .mockResolvedValueOnce({ ok: false, status: 404 }) // download returns 404
        .mockResolvedValueOnce({ ok: true }) // upload succeeds

      await sync()

      expect(fetch).toHaveBeenCalledTimes(2)
    })

    it('should download remote data if it is newer', async () => {
      const local = await initialize()

      // Remote data is newer
      const remote = { ...local, timestamp: local.timestamp + 1000, settings: { ...local.settings, name: 'Remote' } }

      const key = await require('../core/storage').loadKey()
      const encrypted = await require('../core/crypto').encrypt(key, remote)

      ;(fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ encryptedBlob: encrypted })
      })

      await sync()

      const updated = await getData()
      expect(updated.settings.name).toBe('Remote')
    })

    it('should upload local data if it is newer', async () => {
      const local = await initialize()
      await setData({ settings: { ...local.settings, name: 'Local' } })

      // Remote data is older
      const remote = { ...local, timestamp: local.timestamp - 1000 }

      const key = await require('../core/storage').loadKey()
      const encrypted = await require('../core/crypto').encrypt(key, remote)

      ;(fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ encryptedBlob: encrypted })
        })
        .mockResolvedValueOnce({ ok: true }) // upload

      await sync()

      expect(fetch).toHaveBeenCalledTimes(2)
      const uploaded = (fetch as any).mock.calls[1][1].body
      expect(uploaded).toContain('encryptedBlob')
    })
  })

  describe('enableAutoSync', () => {
    it('should sync on window focus', async () => {
      await initialize()

      ;(fetch as any).mockResolvedValue({ ok: false, status: 404 })

      enableAutoSync()

      window.dispatchEvent(new Event('focus'))

      // Give async operations time to complete
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(fetch).toHaveBeenCalled()
    })
  })
})
```

**Step 2: Run test to verify it fails**

```bash
cd packages/frontend
npm test -- sync.test.ts
```

Expected: FAIL - module not found

**Step 3: Write sync plugin implementation**

Create `packages/frontend/src/features/UserData/plugins/sync.ts`:

```typescript
import { UserData } from '../core/types'
import { getData, setData } from '../core/userData'
import { loadKey, getUserId } from '../core/storage'
import { encrypt, decrypt } from '../core/crypto'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5175'

let autoSyncEnabled = false
let focusHandler: (() => void) | null = null
let blurHandler: (() => void) | null = null
let unloadHandler: (() => void) | null = null

/**
 * Upload user data to server
 */
export async function upload(data: UserData): Promise<void> {
  try {
    const key = await loadKey()
    if (!key) {
      throw new Error('Encryption key not found')
    }

    const encrypted = await encrypt(key, data)

    const response = await fetch(`${API_BASE}/api/sync/${data.userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ encryptedBlob: encrypted })
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`)
    }
  } catch (error) {
    console.error('Upload failed:', error)
    throw error
  }
}

/**
 * Download user data from server
 */
export async function download(): Promise<UserData | null> {
  try {
    const userId = await getUserId()
    if (!userId) {
      throw new Error('User ID not found')
    }

    const response = await fetch(`${API_BASE}/api/sync/${userId}`)

    if (response.status === 404) {
      // User not found on server (first sync)
      return null
    }

    if (!response.ok) {
      throw new Error(`Download failed: ${response.status}`)
    }

    const { encryptedBlob } = await response.json()

    const key = await loadKey()
    if (!key) {
      throw new Error('Encryption key not found')
    }

    const data = await decrypt(key, encryptedBlob)
    return data
  } catch (error) {
    console.error('Download failed:', error)
    throw error
  }
}

/**
 * Sync: Smart merge with last-write-wins conflict resolution
 */
export async function sync(): Promise<void> {
  try {
    const local = await getData()
    const remote = await download()

    if (!remote) {
      // No remote data, upload local
      await upload(local)
      return
    }

    // Compare timestamps
    if (remote.timestamp > local.timestamp) {
      // Remote is newer, update local
      await setData(remote)
    } else {
      // Local is newer, upload
      await upload(local)
    }
  } catch (error) {
    console.warn('Sync failed, continuing offline:', error)
    // Don't throw - sync is optional
  }
}

/**
 * Enable automatic sync on window events
 */
export function enableAutoSync(): void {
  if (autoSyncEnabled) return

  focusHandler = () => {
    sync().catch(console.warn)
  }

  blurHandler = () => {
    getData().then(upload).catch(console.warn)
  }

  unloadHandler = () => {
    getData().then(upload).catch(console.warn)
  }

  window.addEventListener('focus', focusHandler)
  window.addEventListener('blur', blurHandler)
  window.addEventListener('beforeunload', unloadHandler)

  autoSyncEnabled = true
}

/**
 * Disable automatic sync
 */
export function disableAutoSync(): void {
  if (!autoSyncEnabled) return

  if (focusHandler) window.removeEventListener('focus', focusHandler)
  if (blurHandler) window.removeEventListener('blur', blurHandler)
  if (unloadHandler) window.removeEventListener('beforeunload', unloadHandler)

  focusHandler = null
  blurHandler = null
  unloadHandler = null
  autoSyncEnabled = false
}
```

**Step 4: Run tests to verify they pass**

```bash
cd packages/frontend
npm test -- sync.test.ts
```

Expected: PASS (all tests)

**Step 5: Commit**

```bash
git add packages/frontend/src/features/UserData/
git commit -m "feat: add sync plugin for UserData

- Implement upload/download to server API
- Add smart sync with last-write-wins
- Support auto-sync on focus/blur/unload
- Fail gracefully on network errors
- Add comprehensive sync tests

Part of UserData refactor.
"
```

---

## Task 5: Export and QR Plugins

**Files:**
- Create: `packages/frontend/src/features/UserData/plugins/export.ts`
- Create: `packages/frontend/src/features/UserData/plugins/qr.ts`
- Create: `packages/frontend/src/features/UserData/__tests__/export.test.ts`
- Create: `packages/frontend/src/features/UserData/__tests__/qr.test.ts`

**Step 1: Write failing tests**

Create `packages/frontend/src/features/UserData/__tests__/export.test.ts`:

```typescript
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import { exportData, importData } from '../plugins/export'
import { initialize, getData, updateSettings } from '../core/userData'
import { clearStorage } from '../core/storage'

describe('Export Plugin', () => {
  beforeEach(async () => {
    await clearStorage()
    localStorage.clear()
  })

  afterEach(async () => {
    await clearStorage()
    localStorage.clear()
  })

  describe('exportData', () => {
    it('should export user data as JSON string', async () => {
      await initialize()
      await updateSettings({ name: 'Alice', age: 12 })

      const exported = await exportData()
      const parsed = JSON.parse(exported)

      expect(parsed.settings.name).toBe('Alice')
      expect(parsed.settings.age).toBe(12)
      expect(parsed.userId).toBeDefined()
    })
  })

  describe('importData', () => {
    it('should import user data from JSON string', async () => {
      await initialize()

      const importedData = {
        userId: 'imported-user-id',
        settings: { name: 'Bob', age: 14, language: 'de', gender: 'male' },
        progress: { math: { easy: { correct: 10 } } },
        lastTask: { subject: 'math', concept: 'arithmetic' },
        timestamp: Date.now()
      }

      await importData(JSON.stringify(importedData))

      const data = await getData()
      expect(data.settings.name).toBe('Bob')
      expect(data.progress.math.easy.correct).toBe(10)
    })

    it('should merge progress additively (never lose data)', async () => {
      await initialize()

      // Set some initial progress
      await require('../core/userData').updateProgress({
        logic: { easy: { correct: 5, wrong: 2 } }
      })

      // Import data with different progress
      const importedData = {
        userId: 'new-id',
        settings: { name: 'Charlie', age: 10, language: 'en', gender: 'male' },
        progress: { math: { medium: { correct: 8, wrong: 1 } } },
        lastTask: { subject: '', concept: '' },
        timestamp: Date.now()
      }

      await importData(JSON.stringify(importedData))

      const data = await getData()
      // Should have both
      expect(data.progress.logic.easy.correct).toBe(5)
      expect(data.progress.math.medium.correct).toBe(8)
    })
  })
})
```

Create `packages/frontend/src/features/UserData/__tests__/qr.test.ts`:

```typescript
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import { generateQRData, importQRData } from '../plugins/qr'
import { initialize, getData } from '../core/userData'
import { clearStorage, loadKey, getUserId } from '../core/storage'

describe('QR Plugin', () => {
  beforeEach(async () => {
    await clearStorage()
    localStorage.clear()
  })

  afterEach(async () => {
    await clearStorage()
    localStorage.clear()
  })

  describe('generateQRData', () => {
    it('should generate QR payload with userId and key', async () => {
      await initialize()

      const qrData = await generateQRData()

      expect(qrData.userId).toBeDefined()
      expect(qrData.key).toBeDefined()
      expect(qrData.timestamp).toBeGreaterThan(0)

      // Key should be a JWK JSON string
      const keyObj = JSON.parse(qrData.key)
      expect(keyObj.kty).toBe('oct') // Symmetric key
    })
  })

  describe('importQRData', () => {
    it('should import userId and key from QR data', async () => {
      // Generate QR from device 1
      const data1 = await initialize()
      const qrData = await generateQRData()

      // Clear storage (simulate device 2)
      await clearStorage()
      localStorage.clear()

      // Import QR on device 2
      await importQRData(qrData)

      // Should have same userId
      const userId2 = await getUserId()
      expect(userId2).toBe(data1.userId)

      // Should be able to decrypt existing data
      const key2 = await loadKey()
      expect(key2).toBeDefined()
    })
  })
})
```

**Step 2: Run tests to verify they fail**

```bash
cd packages/frontend
npm test -- export.test.ts qr.test.ts
```

Expected: FAIL - modules not found

**Step 3: Write export plugin implementation**

Create `packages/frontend/src/features/UserData/plugins/export.ts`:

```typescript
import { UserData } from '../core/types'
import { getData, setData } from '../core/userData'

/**
 * Export user data as unencrypted JSON string
 */
export async function exportData(): Promise<string> {
  const data = await getData()
  return JSON.stringify(data, null, 2)
}

/**
 * Import user data from JSON string
 * Merges progress additively (never loses data)
 */
export async function importData(json: string): Promise<void> {
  const imported: UserData = JSON.parse(json)
  const current = await getData()

  // Merge progress additively
  const mergedProgress = mergeProgress(current.progress, imported.progress)

  const merged: UserData = {
    ...imported,
    progress: mergedProgress,
    timestamp: Date.now()
  }

  await setData(merged)
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
```

**Step 4: Write QR plugin implementation**

Create `packages/frontend/src/features/UserData/plugins/qr.ts`:

```typescript
import { loadKey, storeKey, storeUserId } from '../core/storage'
import { exportKey, importKey } from '../core/crypto'
import { sync } from './sync'

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

  const userId = await require('../core/storage').getUserId()
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
 * Import QR code data from another device
 */
export async function importQRData(payload: QRPayload): Promise<void> {
  // Import the encryption key
  const keyJwk = JSON.parse(payload.key)
  const key = await importKey(keyJwk)

  // Store key and userId
  await storeKey(key)
  await storeUserId(payload.userId)

  // Sync data from server
  await sync()
}
```

**Step 5: Run tests to verify they pass**

```bash
cd packages/frontend
npm test -- export.test.ts qr.test.ts
```

Expected: PASS (all tests)

**Step 6: Commit**

```bash
git add packages/frontend/src/features/UserData/
git commit -m "feat: add export and QR plugins for UserData

Export plugin:
- Export unencrypted JSON for portability
- Import with additive progress merge

QR plugin:
- Generate QR payload with userId + key
- Import QR to pair devices
- Auto-sync after pairing

Part of UserData refactor.
"
```

---

## Task 6: React Context Integration

**Files:**
- Create: `packages/frontend/src/features/UserData/context/UserDataContext.tsx`
- Create: `packages/frontend/src/features/UserData/context/useUserData.ts`
- Create: `packages/frontend/src/features/UserData/index.ts`

**Step 1: Create React context wrapper**

Create `packages/frontend/src/features/UserData/context/UserDataContext.tsx`:

```typescript
import React, { createContext, useState, useEffect, ReactNode } from 'react'
import { UserData, UserSettings } from '../core/types'
import { initialize, getData, updateSettings as coreUpdateSettings, updateProgress as coreUpdateProgress } from '../core/userData'
import * as syncPlugin from '../plugins/sync'
import * as exportPlugin from '../plugins/export'
import * as qrPlugin from '../plugins/qr'

export interface UserDataContextValue {
  data: UserData | null
  isLoading: boolean
  error: Error | null

  // Core operations
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>
  updateProgress: (progress: Record<string, any>) => Promise<void>
  refresh: () => Promise<void>

  // Plugin operations
  sync: () => Promise<void>
  exportData: () => Promise<string>
  importData: (json: string) => Promise<void>
  generateQR: () => Promise<qrPlugin.QRPayload>
  importQR: (payload: qrPlugin.QRPayload) => Promise<void>
}

export const UserDataContext = createContext<UserDataContextValue | null>(null)

interface UserDataProviderProps {
  children: ReactNode
  enableAutoSync?: boolean
}

export function UserDataProvider({ children, enableAutoSync = true }: UserDataProviderProps) {
  const [data, setData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Initialize once
  useEffect(() => {
    initialize()
      .then(d => setData(d))
      .catch(e => setError(e))
      .finally(() => setIsLoading(false))
  }, [])

  // Listen for data changes
  useEffect(() => {
    const handler = () => refresh()
    window.addEventListener('data-changed', handler)
    return () => window.removeEventListener('data-changed', handler)
  }, [])

  // Enable auto-sync
  useEffect(() => {
    if (enableAutoSync) {
      syncPlugin.enableAutoSync()
      return () => syncPlugin.disableAutoSync()
    }
  }, [enableAutoSync])

  const refresh = async () => {
    try {
      const updated = await getData()
      setData(updated)
      setError(null)
    } catch (e) {
      setError(e as Error)
    }
  }

  // Core operations (pass-through to core)
  const updateSettings = async (settings: Partial<UserSettings>) => {
    await coreUpdateSettings(settings)
    await refresh()
  }

  const updateProgress = async (progress: Record<string, any>) => {
    await coreUpdateProgress(progress)
    await refresh()
  }

  // Plugin operations
  const sync = async () => {
    await syncPlugin.sync()
    await refresh()
  }

  const exportData = async () => {
    return await exportPlugin.exportData()
  }

  const importData = async (json: string) => {
    await exportPlugin.importData(json)
    await refresh()
  }

  const generateQR = async () => {
    return await qrPlugin.generateQRData()
  }

  const importQR = async (payload: qrPlugin.QRPayload) => {
    await qrPlugin.importQRData(payload)
    await refresh()
  }

  const value: UserDataContextValue = {
    data,
    isLoading,
    error,
    updateSettings,
    updateProgress,
    refresh,
    sync,
    exportData,
    importData,
    generateQR,
    importQR
  }

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  )
}
```

**Step 2: Create custom hook**

Create `packages/frontend/src/features/UserData/context/useUserData.ts`:

```typescript
import { useContext } from 'react'
import { UserDataContext, UserDataContextValue } from './UserDataContext'

export function useUserData(): UserDataContextValue {
  const context = useContext(UserDataContext)
  if (!context) {
    throw new Error('useUserData must be used within UserDataProvider')
  }
  return context
}
```

**Step 3: Create public API**

Create `packages/frontend/src/features/UserData/index.ts`:

```typescript
// Context
export { UserDataProvider } from './context/UserDataContext'
export { useUserData } from './context/useUserData'
export type { UserDataContextValue } from './context/UserDataContext'

// Types
export type { UserData, UserSettings, LastTask } from './core/types'

// Core operations (for non-React usage)
export { initialize, getData, setData, updateSettings, updateProgress } from './core/userData'

// Plugins (for non-React usage)
export * as sync from './plugins/sync'
export * as exportPlugin from './plugins/export'
export * as qr from './plugins/qr'
```

**Step 4: Commit**

```bash
git add packages/frontend/src/features/UserData/
git commit -m "feat: add React context for UserData

- Create thin UserDataProvider wrapper
- Add useUserData hook
- Pass-through to core operations (no business logic)
- Support plugin operations via context
- Enable auto-sync by default
- Export public API

Part of UserData refactor.
"
```

---

## Task 7: Update Providers to Use New UserData

**Files:**
- Modify: `packages/frontend/src/features/base/Providers/Providers.tsx`

**Step 1: Update Providers component**

Read current Providers file:

```bash
cat packages/frontend/src/features/base/Providers/Providers.tsx
```

**Step 2: Replace old UserDataProvider with new one**

Edit `packages/frontend/src/features/base/Providers/Providers.tsx`:

```typescript
// Remove old import
- import { UserDataProvider } from '@/features/Auth/context/UserDataContext'

// Add new import
+ import { UserDataProvider } from '@/features/UserData'

// The rest stays the same - UserDataProvider is drop-in replacement
```

**Step 3: Test that app still loads**

```bash
docker compose exec frontend-dev npm run dev
```

Open browser to http://localhost:5173 and verify:
- App loads without errors
- Console shows no UserData errors

**Step 4: Commit**

```bash
git add packages/frontend/src/features/base/Providers/Providers.tsx
git commit -m "refactor: switch to new UserData provider

Replace old UserDataProvider with new simplified version.
Drop-in replacement, no functional changes yet.

Part of UserData refactor.
"
```

---

## Task 8: Update Components to Use New API

**Files:**
- Modify: `packages/frontend/src/features/Auth/components/SettingsForm.tsx`
- Modify: `packages/frontend/src/features/Auth/components/AccountPage.tsx`
- Modify: `packages/frontend/src/features/Auth/components/ExportImport.tsx`
- Modify: `packages/frontend/src/features/Auth/components/QRPairing.tsx`
- Modify: Any other components using `useUserData()`

**Step 1: Find all components using old API**

```bash
cd packages/frontend
grep -r "useUserData" src/features/ --include="*.tsx" --include="*.ts"
```

**Step 2: Update SettingsForm**

Edit `packages/frontend/src/features/Auth/components/SettingsForm.tsx`:

Before:
```typescript
const { name, age, language, gender, updateName, updateAge, updateLanguage, updateGender } = useUserData()
```

After:
```typescript
const { data, updateSettings } = useUserData()

// In handlers:
- await updateName(value)
+ await updateSettings({ name: value })

- await updateAge(value)
+ await updateSettings({ age: value })

- await updateLanguage(value)
+ await updateSettings({ language: value })

- await updateGender(value)
+ await updateSettings({ gender: value })

// Display values:
- {name}
+ {data?.settings.name}
```

**Step 3: Update AccountPage**

Edit `packages/frontend/src/features/Auth/components/AccountPage.tsx`:

Before:
```typescript
const { userId, isAuthenticated, logout, deleteAccount } = useUserData()
```

After:
```typescript
const { data, sync } = useUserData()

// userId:
- {userId}
+ {data?.userId}

// isAuthenticated is now implicit (always true)
// logout, deleteAccount moved to separate functions if needed
```

**Step 4: Update ExportImport**

Edit `packages/frontend/src/features/Auth/components/ExportImport.tsx`:

Before:
```typescript
const { exportData: exportUserData, importData: importUserData } = useUserData()
```

After:
```typescript
const { exportData, importData } = useUserData()

// Usage stays the same - same function names
```

**Step 5: Update QRPairing**

Edit `packages/frontend/src/features/Auth/components/QRPairing.tsx`:

Before:
```typescript
const { generateQR, scanQR } = useUserData()
```

After:
```typescript
const { generateQR, importQR } = useUserData()

// Update scanQR to importQR:
- await scanQR(qrData)
+ await importQR(qrData)
```

**Step 6: Update Stats components**

Search for any components using progress:

```bash
grep -r "progress" src/features/Stats/ --include="*.tsx"
```

Update to use:
```typescript
const { data, updateProgress } = useUserData()

// Access:
- progress.math.easy
+ data?.progress.math?.easy

// Update:
await updateProgress({ math: { easy: { correct: 5 } } })
```

**Step 7: Test all updated components**

```bash
docker compose exec frontend-dev npm run dev
```

Manually test:
- [ ] Settings form updates name/age/language/gender
- [ ] Account page displays userId
- [ ] Export/import works
- [ ] QR pairing generates QR
- [ ] Stats display progress correctly

**Step 8: Run frontend tests**

```bash
docker compose exec frontend-dev npm test
```

Expected: All tests pass (or update tests for new API)

**Step 9: Commit**

```bash
git add packages/frontend/src/features/Auth/ packages/frontend/src/features/Stats/
git commit -m "refactor: update components to use new UserData API

- Replace separate update functions with single updateSettings
- Access data via data.settings instead of individual properties
- Update QR pairing to use importQR instead of scanQR
- Simplify component logic (no auth branching)

Part of UserData refactor.
"
```

---

## Task 9: Delete Old Code

**Files:**
- Delete: `packages/frontend/src/features/Auth/hooks/useAuth.ts`
- Delete: `packages/frontend/src/features/Auth/services/sync.service.ts`
- Delete: `packages/frontend/src/features/Auth/services/storage.service.ts`
- Delete: `packages/frontend/src/features/Auth/services/crypto.service.ts`
- Delete: `packages/frontend/src/features/Auth/context/UserDataContext.tsx`
- Delete: `packages/frontend/src/features/Profile/useUserProfile.ts`
- Delete: `packages/frontend/src/features/Task/useLastTask.ts`
- Delete: `packages/frontend/src/features/Stats/progressService.ts`

**Step 1: Remove old Auth files**

```bash
git rm packages/frontend/src/features/Auth/hooks/useAuth.ts
git rm packages/frontend/src/features/Auth/services/sync.service.ts
git rm packages/frontend/src/features/Auth/services/storage.service.ts
git rm packages/frontend/src/features/Auth/services/crypto.service.ts
git rm packages/frontend/src/features/Auth/context/UserDataContext.tsx
```

**Step 2: Remove legacy Profile hook**

```bash
git rm packages/frontend/src/features/Profile/useUserProfile.ts
```

**Step 3: Remove Task hook (merged into UserData)**

```bash
git rm packages/frontend/src/features/Task/useLastTask.ts
```

**Step 4: Remove Stats service (merged into UserData)**

```bash
git rm packages/frontend/src/features/Stats/progressService.ts
```

**Step 5: Verify no imports remain**

```bash
cd packages/frontend
grep -r "useAuth" src/ --include="*.tsx" --include="*.ts"
grep -r "sync.service" src/ --include="*.tsx" --include="*.ts"
grep -r "storage.service" src/ --include="*.tsx" --include="*.ts"
grep -r "crypto.service" src/ --include="*.tsx" --include="*.ts"
grep -r "useUserProfile" src/ --include="*.tsx" --include="*.ts"
grep -r "useLastTask" src/ --include="*.tsx" --include="*.ts"
grep -r "progressService" src/ --include="*.tsx" --include="*.ts"
```

Expected: No results (all imports removed)

**Step 6: Run tests to verify nothing broken**

```bash
docker compose exec frontend-dev npm test
```

Expected: All tests pass

**Step 7: Run app to verify it works**

```bash
docker compose exec frontend-dev npm run dev
```

Manually verify:
- [ ] App loads
- [ ] Settings work
- [ ] Progress tracking works
- [ ] Export/import works
- [ ] No console errors

**Step 8: Commit**

```bash
git commit -m "refactor: remove old UserData implementation

Delete replaced files:
- Auth hooks, services, context (8 files)
- Legacy Profile hook
- Task preference hook (merged into UserData)
- Stats service (merged into UserData)

All functionality now in new UserData feature.

Part of UserData refactor - COMPLETE.
"
```

---

## Task 10: Clear Old localStorage Keys on App Load

**Files:**
- Modify: `packages/frontend/src/features/UserData/core/userData.ts`

**Step 1: Add migration cleanup to initialize function**

Edit `packages/frontend/src/features/UserData/core/userData.ts`:

Add after successful initialization:

```typescript
export async function initialize(): Promise<UserData> {
  try {
    // Check if we already have data
    const existingUserId = await getUserId()
    const existingData = localStorage.getItem(STORAGE_KEY)

    if (existingUserId && existingData) {
      // Already initialized - clean up old keys if they exist
      cleanupLegacyStorage()
      return await getData()
    }

    // ... rest of initialization ...

    // Clean up any legacy storage
    cleanupLegacyStorage()

    return defaultData
  } catch (error) {
    console.error('Failed to initialize user data:', error)
    throw error
  }
}

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
```

**Step 2: Test cleanup**

```bash
# Manually add legacy keys
localStorage.setItem('logikids_progress', '{}')
localStorage.setItem('logikids_user_profile', '{}')
localStorage.setItem('logikids_last_task', '{}')

# Refresh app
# Check console for cleanup messages
# Verify keys are gone
```

**Step 3: Commit**

```bash
git add packages/frontend/src/features/UserData/core/userData.ts
git commit -m "feat: clean up legacy localStorage keys on init

Remove old storage keys from previous implementation:
- logikids_progress
- logikids_user_profile
- logikids_last_task

Clean slate for all users.

Part of UserData refactor.
"
```

---

## Summary

**Total Tasks:** 10
**Estimated Time:** 4-6 hours
**Files Created:** 15
**Files Modified:** ~5-10
**Files Deleted:** 8
**Code Reduction:** ~50% (1200 → 600 lines)

**Testing Strategy:**
- Unit tests for each module (storage, crypto, userData, plugins)
- Integration tests for plugin interactions
- Manual E2E testing of all user-facing features
- Verify no regressions in existing functionality

**Rollback Plan:**
If issues arise, revert commits in reverse order. Old code preserved in git history.

**Success Criteria:**
- ✅ All tests pass
- ✅ App loads without errors
- ✅ Settings updates work
- ✅ Progress tracking works
- ✅ Export/import works
- ✅ QR pairing works
- ✅ Sync works (if backend available)
- ✅ No console errors
- ✅ Old storage keys cleaned up
