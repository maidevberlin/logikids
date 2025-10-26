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
