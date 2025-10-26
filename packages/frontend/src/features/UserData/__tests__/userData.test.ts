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

    it('should clean up legacy localStorage keys on first initialization', async () => {
      // Add legacy keys
      localStorage.setItem('logikids_progress', '{"math": {"easy": {"correct": 5}}}')
      localStorage.setItem('logikids_user_profile', '{"name": "OldUser"}')
      localStorage.setItem('logikids_last_task', '{"subject": "math"}')

      // Verify they exist
      expect(localStorage.getItem('logikids_progress')).toBeDefined()
      expect(localStorage.getItem('logikids_user_profile')).toBeDefined()
      expect(localStorage.getItem('logikids_last_task')).toBeDefined()

      // Initialize (first time)
      await initialize()

      // Verify legacy keys are removed
      expect(localStorage.getItem('logikids_progress')).toBeNull()
      expect(localStorage.getItem('logikids_user_profile')).toBeNull()
      expect(localStorage.getItem('logikids_last_task')).toBeNull()
    })

    it('should clean up legacy localStorage keys on subsequent initializations', async () => {
      // First initialization
      await initialize()

      // Add legacy keys (simulating old data lingering)
      localStorage.setItem('logikids_progress', '{"math": {"easy": {"correct": 5}}}')
      localStorage.setItem('logikids_user_profile', '{"name": "OldUser"}')
      localStorage.setItem('logikids_last_task', '{"subject": "math"}')

      // Initialize again (existing user)
      await initialize()

      // Verify legacy keys are removed
      expect(localStorage.getItem('logikids_progress')).toBeNull()
      expect(localStorage.getItem('logikids_user_profile')).toBeNull()
      expect(localStorage.getItem('logikids_last_task')).toBeNull()
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
