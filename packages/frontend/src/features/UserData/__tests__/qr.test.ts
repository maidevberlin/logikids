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
