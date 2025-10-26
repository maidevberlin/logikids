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
