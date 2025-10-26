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
