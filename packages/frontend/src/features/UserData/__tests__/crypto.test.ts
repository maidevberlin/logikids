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
