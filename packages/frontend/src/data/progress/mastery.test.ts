import { describe, it, expect } from 'vitest'
import { calculateConceptStars } from './mastery'
import { ConceptStats, AttemptData, ConceptAggregate } from './types'

// Test helper: creates a minimal aggregate (not used by calculateConceptStars which uses attempts directly)
const emptyAggregate: ConceptAggregate = {
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
}

describe('calculateConceptStars', () => {
  const createAttempt = (correct: boolean, timestamp = Date.now()): AttemptData => ({
    id: Math.random().toString(),
    difficulty: 'medium',
    correct,
    hintsUsed: 0,
    timeSeconds: 60,
    timestamp,
    skipped: false
  })

  it('returns 0 stars for undefined stats', () => {
    expect(calculateConceptStars(undefined)).toBe(0)
  })

  it('returns 0 stars for no attempts', () => {
    const stats: ConceptStats = {
      attempts: [],
      aggregate: {
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
      }
    }
    expect(calculateConceptStars(stats)).toBe(0)
  })

  it('returns 0 stars for 0% success rate', () => {
    const stats: ConceptStats = {
      attempts: [createAttempt(false), createAttempt(false), createAttempt(false)],
      aggregate: emptyAggregate
    }
    expect(calculateConceptStars(stats)).toBe(0)
  })

  it('returns 1 star for 30% success rate', () => {
    const attempts = [
      createAttempt(true),
      createAttempt(false),
      createAttempt(false),
      createAttempt(false)
    ]
    const stats: ConceptStats = { attempts, aggregate: emptyAggregate }
    expect(calculateConceptStars(stats)).toBe(1)
  })

  it('returns 2 stars for 50% success rate', () => {
    const attempts = [
      createAttempt(true),
      createAttempt(true),
      createAttempt(false),
      createAttempt(false)
    ]
    const stats: ConceptStats = { attempts, aggregate: emptyAggregate }
    expect(calculateConceptStars(stats)).toBe(2)
  })

  it('returns 3 stars for 70% success rate', () => {
    const attempts = Array(10).fill(null).map((_, i) => createAttempt(i < 7))
    const stats: ConceptStats = { attempts, aggregate: emptyAggregate }
    expect(calculateConceptStars(stats)).toBe(3)
  })

  it('returns 4 stars for 85% success rate', () => {
    const attempts = Array(20).fill(null).map((_, i) => createAttempt(i < 17))
    const stats: ConceptStats = { attempts, aggregate: emptyAggregate }
    expect(calculateConceptStars(stats)).toBe(4)
  })

  it('returns 5 stars for 90%+ success rate', () => {
    const attempts = Array(20).fill(null).map((_, i) => createAttempt(i < 19))
    const stats: ConceptStats = { attempts, aggregate: emptyAggregate }
    expect(calculateConceptStars(stats)).toBe(5)
  })

  it('uses only last 100 attempts', () => {
    const attempts = [
      ...Array(50).fill(null).map(() => createAttempt(false)), // Old bad attempts
      ...Array(100).fill(null).map((_, i) => createAttempt(i < 90)) // Recent 90% success
    ]
    const stats: ConceptStats = { attempts, aggregate: emptyAggregate }
    expect(calculateConceptStars(stats)).toBe(5)
  })

  it('excludes skipped attempts from calculation', () => {
    const attempts = [
      createAttempt(true),
      { ...createAttempt(false), correct: null, skipped: true },
      { ...createAttempt(false), correct: null, skipped: true },
      createAttempt(true)
    ]
    const stats: ConceptStats = { attempts, aggregate: emptyAggregate }
    // 2 correct out of 2 scored = 100% = 5 stars
    expect(calculateConceptStars(stats)).toBe(5)
  })

  it('returns 0 stars if all attempts are skipped', () => {
    const attempts = [
      { ...createAttempt(false), correct: null, skipped: true },
      { ...createAttempt(false), correct: null, skipped: true }
    ]
    const stats: ConceptStats = { attempts, aggregate: emptyAggregate }
    expect(calculateConceptStars(stats)).toBe(0)
  })
})
