import { describe, it, expect } from 'vitest'
import { adjustDifficulty } from '../difficultyAdjuster'
import { ConceptStats, AttemptData } from '../types'

describe('adjustDifficulty', () => {
  const createAttempt = (overrides: Partial<AttemptData>): AttemptData => ({
    id: 'test-id',
    difficulty: 'medium',
    correct: true,
    hintsUsed: 0,
    timeSeconds: 60,
    timestamp: Date.now(),
    skipped: false,
    ...overrides
  })

  const createConceptStats = (
    difficulty: 'easy' | 'medium' | 'hard',
    attempts: AttemptData[]
  ): ConceptStats => ({
    attempts,
    aggregate: {
      totalAttempts: attempts.length,
      correct: 0,
      wrong: 0,
      skipped: 0,
      totalHintsUsed: 0,
      totalTimeSeconds: 0,
      averageTimeSeconds: 0,
      successRate: 0,
      lastAttemptTimestamp: 0,
      firstAttemptTimestamp: 0
    },
    difficulty
  })

  describe('level up scenarios', () => {
    it('levels up from easy to medium after 3 first-try-correct', () => {
      const stats = createConceptStats('easy', [
        createAttempt({ correct: true, hintsUsed: 0 }),
        createAttempt({ correct: true, hintsUsed: 0 }),
        createAttempt({ correct: true, hintsUsed: 0 })
      ])
      const result = adjustDifficulty(stats)
      expect(result.newDifficulty).toBe('medium')
      expect(result.notification?.type).toBe('level_up')
      expect(result.notification?.message).toContain('Medium')
    })

    it('levels up from medium to hard after 3 first-try-correct', () => {
      const stats = createConceptStats('medium', [
        createAttempt({ correct: true, hintsUsed: 0 }),
        createAttempt({ correct: true, hintsUsed: 0 }),
        createAttempt({ correct: true, hintsUsed: 0 })
      ])
      const result = adjustDifficulty(stats)
      expect(result.newDifficulty).toBe('hard')
      expect(result.notification?.type).toBe('level_up')
      expect(result.notification?.message).toContain('Hard')
    })

    it('shows achievement at hard level after 3 first-try-correct', () => {
      const stats = createConceptStats('hard', [
        createAttempt({ correct: true, hintsUsed: 0 }),
        createAttempt({ correct: true, hintsUsed: 0 }),
        createAttempt({ correct: true, hintsUsed: 0 })
      ])
      const result = adjustDifficulty(stats)
      expect(result.newDifficulty).toBe('hard')
      expect(result.notification?.type).toBe('achievement')
      expect(result.notification?.message).toContain('Mastering')
    })
  })

  describe('level down scenarios', () => {
    it('levels down from hard to medium after 2 skips', () => {
      const stats = createConceptStats('hard', [
        createAttempt({ skipped: true }),
        createAttempt({ skipped: true })
      ])
      const result = adjustDifficulty(stats)
      expect(result.newDifficulty).toBe('medium')
      expect(result.notification?.type).toBe('level_down')
      expect(result.notification?.message).toContain('Medium')
    })

    it('levels down from medium to easy after 2 skips', () => {
      const stats = createConceptStats('medium', [
        createAttempt({ skipped: true }),
        createAttempt({ skipped: true })
      ])
      const result = adjustDifficulty(stats)
      expect(result.newDifficulty).toBe('easy')
      expect(result.notification?.type).toBe('level_down')
      expect(result.notification?.message).toContain('Easy')
    })

    it('shows achievement at easy level after 2 skips', () => {
      const stats = createConceptStats('easy', [
        createAttempt({ skipped: true }),
        createAttempt({ skipped: true })
      ])
      const result = adjustDifficulty(stats)
      expect(result.newDifficulty).toBe('easy')
      expect(result.notification?.type).toBe('achievement')
      expect(result.notification?.message).toContain('practicing')
    })
  })

  describe('no change scenarios', () => {
    it('returns null notification when no threshold met', () => {
      const stats = createConceptStats('medium', [
        createAttempt({ correct: true, hintsUsed: 0 }),
        createAttempt({ correct: true, hintsUsed: 0 })
      ])
      const result = adjustDifficulty(stats)
      expect(result.newDifficulty).toBe('medium')
      expect(result.notification).toBeNull()
    })

    it('defaults to medium when difficulty field missing', () => {
      const stats = createConceptStats('medium', [])
      delete stats.difficulty
      const result = adjustDifficulty(stats)
      expect(result.newDifficulty).toBe('medium')
    })
  })
})
