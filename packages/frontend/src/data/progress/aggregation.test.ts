import { describe, it, expect } from 'vitest'
import {
  calculateConceptAggregate,
  calculateSubjectMastery,
  calculateStars,
  pruneOldAttempts,
  isDuplicate,
  generateAttemptId
} from './aggregation'
import { ConceptStats, AttemptData, Difficulty } from './types'

describe('aggregation', () => {
  const createAttempt = (
    correct: boolean,
    timestamp = Date.now(),
    hintsUsed = 0,
    timeSeconds = 60,
    difficulty: Difficulty = 'medium'
  ): AttemptData => ({
    id: Math.random().toString(),
    difficulty,
    correct,
    hintsUsed,
    timeSeconds,
    timestamp,
    skipped: false
  })

  describe('calculateConceptAggregate', () => {
    it('returns zero aggregate for empty attempts', () => {
      const result = calculateConceptAggregate([])
      expect(result).toEqual({
        totalAttempts: 0,
        correct: 0,
        wrong: 0,
        skipped: 0,
        totalHintsUsed: 0,
        totalTimeSeconds: 0,
        averageTimeSeconds: 0,
        successRate: 0,
        lastAttemptTimestamp: 0,
        firstAttemptTimestamp: 0
      })
    })

    it('calculates correct aggregate for single attempt', () => {
      const timestamp = Date.now()
      const attempts = [createAttempt(true, timestamp, 2, 120)]
      const result = calculateConceptAggregate(attempts)

      expect(result.totalAttempts).toBe(1)
      expect(result.correct).toBe(1)
      expect(result.wrong).toBe(0)
      expect(result.totalHintsUsed).toBe(2)
      expect(result.totalTimeSeconds).toBe(120)
      expect(result.averageTimeSeconds).toBe(120)
      expect(result.successRate).toBe(1)
      expect(result.lastAttemptTimestamp).toBe(timestamp)
      expect(result.firstAttemptTimestamp).toBe(timestamp)
    })

    it('calculates correct success rate', () => {
      const attempts = [
        createAttempt(true),
        createAttempt(true),
        createAttempt(false),
        createAttempt(false)
      ]
      const result = calculateConceptAggregate(attempts)

      expect(result.correct).toBe(2)
      expect(result.wrong).toBe(2)
      expect(result.successRate).toBe(0.5)
    })

    it('excludes skipped attempts from success rate', () => {
      const attempts = [
        createAttempt(true),
        createAttempt(true),
        { ...createAttempt(false), correct: null, skipped: true }
      ]
      const result = calculateConceptAggregate(attempts)

      expect(result.totalAttempts).toBe(3)
      expect(result.correct).toBe(2)
      expect(result.wrong).toBe(0)
      expect(result.skipped).toBe(1)
      expect(result.successRate).toBe(1) // 2/2 = 100%
    })

    it('calculates correct timestamps', () => {
      const now = Date.now()
      const attempts = [
        createAttempt(true, now - 3000),
        createAttempt(true, now - 1000),
        createAttempt(true, now)
      ]
      const result = calculateConceptAggregate(attempts)

      expect(result.lastAttemptTimestamp).toBe(now)
      expect(result.firstAttemptTimestamp).toBe(now - 3000)
    })
  })

  describe('calculateSubjectMastery', () => {
    it('returns zero mastery for empty concepts', () => {
      const result = calculateSubjectMastery({})

      expect(result.stars).toBe(0)
      expect(result.totalTasks).toBe(0)
      expect(result.successRate).toBe(0)
      expect(result.conceptsMastered).toBe(0)
      expect(result.conceptsInProgress).toBe(0)
      expect(result.conceptsNeedingHelp).toBe(0)
    })

    it('classifies concepts correctly by performance', () => {
      const concepts: Record<string, ConceptStats> = {
        mastered: {
          attempts: [],
          aggregate: {
            totalAttempts: 10,
            correct: 9,
            wrong: 1,
            skipped: 0,
            totalHintsUsed: 0,
            totalTimeSeconds: 600,
            averageTimeSeconds: 60,
            successRate: 0.9,
            lastAttemptTimestamp: Date.now(),
            firstAttemptTimestamp: Date.now()
          }
        },
        needsHelp: {
          attempts: [],
          aggregate: {
            totalAttempts: 10,
            correct: 3,
            wrong: 7,
            skipped: 0,
            totalHintsUsed: 0,
            totalTimeSeconds: 600,
            averageTimeSeconds: 60,
            successRate: 0.3,
            lastAttemptTimestamp: Date.now(),
            firstAttemptTimestamp: Date.now()
          }
        },
        inProgress: {
          attempts: [],
          aggregate: {
            totalAttempts: 10,
            correct: 6,
            wrong: 4,
            skipped: 0,
            totalHintsUsed: 0,
            totalTimeSeconds: 600,
            averageTimeSeconds: 60,
            successRate: 0.6,
            lastAttemptTimestamp: Date.now(),
            firstAttemptTimestamp: Date.now()
          }
        }
      }

      const result = calculateSubjectMastery(concepts)

      expect(result.conceptsMastered).toBe(1)
      expect(result.conceptsNeedingHelp).toBe(1)
      expect(result.conceptsInProgress).toBe(1)
      expect(result.totalTasks).toBe(30)
      expect(result.successRate).toBe(0.6) // 18/30
    })
  })

  describe('calculateStars', () => {
    it('returns correct star ratings', () => {
      expect(calculateStars(0.95)).toBe(5)
      expect(calculateStars(0.90)).toBe(4)
      expect(calculateStars(0.85)).toBe(4)
      expect(calculateStars(0.75)).toBe(3)
      expect(calculateStars(0.70)).toBe(3)
      expect(calculateStars(0.60)).toBe(2)
      expect(calculateStars(0.50)).toBe(2)
      expect(calculateStars(0.40)).toBe(1)
      expect(calculateStars(0.30)).toBe(1)
      expect(calculateStars(0.20)).toBe(0)
      expect(calculateStars(0.00)).toBe(0)
    })
  })

  describe('pruneOldAttempts', () => {
    const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000

    it('returns original stats if no attempts are old', () => {
      const now = Date.now()
      const stats: ConceptStats = {
        attempts: [
          createAttempt(true, now - 1000),
          createAttempt(true, now)
        ],
        aggregate: calculateConceptAggregate([]),
        difficulty: 'hard'
      }

      const result = pruneOldAttempts(stats)

      expect(result).toBe(stats) // Same reference
      expect(result.difficulty).toBe('hard')
    })

    it('prunes attempts older than one year', () => {
      const now = Date.now()
      const recentAttempt = createAttempt(true, now, 0, 60, 'easy')
      const oldAttempt = createAttempt(false, now - ONE_YEAR_MS - 1000, 0, 60, 'medium')

      const stats: ConceptStats = {
        attempts: [oldAttempt, recentAttempt],
        aggregate: calculateConceptAggregate([oldAttempt, recentAttempt]),
        difficulty: 'hard'
      }

      const result = pruneOldAttempts(stats)

      expect(result.attempts).toHaveLength(1)
      expect(result.attempts[0]).toBe(recentAttempt)
    })

    it('preserves difficulty field when pruning', () => {
      const now = Date.now()
      const recentAttempt = createAttempt(true, now)
      const oldAttempt = createAttempt(false, now - ONE_YEAR_MS - 1000)

      const stats: ConceptStats = {
        attempts: [oldAttempt, recentAttempt],
        aggregate: calculateConceptAggregate([oldAttempt, recentAttempt]),
        difficulty: 'easy'
      }

      const result = pruneOldAttempts(stats)

      // This is the critical test - difficulty must be preserved
      expect(result.difficulty).toBe('easy')
      expect(result.attempts).toHaveLength(1)
    })

    it('recalculates aggregate after pruning', () => {
      const now = Date.now()
      const recentAttempt = createAttempt(true, now)
      const oldAttempt = createAttempt(false, now - ONE_YEAR_MS - 1000)

      const stats: ConceptStats = {
        attempts: [oldAttempt, recentAttempt],
        aggregate: calculateConceptAggregate([oldAttempt, recentAttempt]),
        difficulty: 'medium'
      }

      const result = pruneOldAttempts(stats)

      expect(result.aggregate.totalAttempts).toBe(1)
      expect(result.aggregate.correct).toBe(1)
      expect(result.aggregate.successRate).toBe(1)
    })

    it('handles all old attempts being pruned', () => {
      const now = Date.now()
      const stats: ConceptStats = {
        attempts: [
          createAttempt(false, now - ONE_YEAR_MS - 1000),
          createAttempt(false, now - ONE_YEAR_MS - 2000)
        ],
        aggregate: calculateConceptAggregate([]),
        difficulty: 'hard'
      }

      const result = pruneOldAttempts(stats)

      expect(result.attempts).toHaveLength(0)
      expect(result.difficulty).toBe('hard')
      expect(result.aggregate.totalAttempts).toBe(0)
    })
  })

  describe('isDuplicate', () => {
    it('detects duplicate by ID', () => {
      const attempt = createAttempt(true)
      const stats: ConceptStats = {
        attempts: [attempt],
        aggregate: calculateConceptAggregate([])
      }

      expect(isDuplicate(stats, attempt)).toBe(true)
    })

    it('detects duplicate by timestamp and data', () => {
      const timestamp = Date.now()
      const attempt1 = createAttempt(true, timestamp, 2, 60)
      const attempt2 = createAttempt(true, timestamp + 1000, 2, 60) // Within 5 seconds

      const stats: ConceptStats = {
        attempts: [attempt1],
        aggregate: calculateConceptAggregate([])
      }

      expect(isDuplicate(stats, attempt2)).toBe(true)
    })

    it('does not flag as duplicate if data differs', () => {
      const timestamp = Date.now()
      const attempt1 = createAttempt(true, timestamp, 2, 60)
      const attempt2 = createAttempt(false, timestamp + 1000, 2, 60) // Different correctness

      const stats: ConceptStats = {
        attempts: [attempt1],
        aggregate: calculateConceptAggregate([])
      }

      expect(isDuplicate(stats, attempt2)).toBe(false)
    })

    it('does not flag as duplicate if time difference > 5 seconds', () => {
      const timestamp = Date.now()
      const attempt1 = createAttempt(true, timestamp, 2, 60)
      const attempt2 = createAttempt(true, timestamp + 6000, 2, 60) // More than 5 seconds

      const stats: ConceptStats = {
        attempts: [attempt1],
        aggregate: calculateConceptAggregate([])
      }

      expect(isDuplicate(stats, attempt2)).toBe(false)
    })
  })

  describe('generateAttemptId', () => {
    it('generates unique IDs', () => {
      const id1 = generateAttemptId('math', 'algebra', Date.now())
      const id2 = generateAttemptId('math', 'algebra', Date.now())

      expect(id1).not.toBe(id2)
    })

    it('includes subject, concept, and timestamp', () => {
      const timestamp = 1234567890
      const id = generateAttemptId('physics', 'mechanics', timestamp)

      expect(id).toContain('physics')
      expect(id).toContain('mechanics')
      expect(id).toContain('1234567890')
    })
  })
})
