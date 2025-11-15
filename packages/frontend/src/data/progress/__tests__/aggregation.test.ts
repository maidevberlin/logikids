import { describe, it, expect } from 'vitest'
import { calculateDifficultyStreaks } from '../aggregation'
import { AttemptData } from '../types'

describe('calculateDifficultyStreaks', () => {
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

  it('returns zero streaks for empty attempts', () => {
    const result = calculateDifficultyStreaks([])
    expect(result).toEqual({ correctStreak: 0, incorrectStreak: 0 })
  })

  it('counts first-try-correct streak', () => {
    const attempts = [
      createAttempt({ correct: true, hintsUsed: 0, skipped: false }),
      createAttempt({ correct: true, hintsUsed: 0, skipped: false }),
      createAttempt({ correct: true, hintsUsed: 0, skipped: false })
    ]
    const result = calculateDifficultyStreaks(attempts)
    expect(result.correctStreak).toBe(3)
    expect(result.incorrectStreak).toBe(0)
  })

  it('counts skip streak', () => {
    const attempts = [
      createAttempt({ skipped: true }),
      createAttempt({ skipped: true })
    ]
    const result = calculateDifficultyStreaks(attempts)
    expect(result.correctStreak).toBe(0)
    expect(result.incorrectStreak).toBe(2)
  })

  it('breaks streak on eventually-correct (hints used)', () => {
    const attempts = [
      createAttempt({ correct: true, hintsUsed: 0 }),
      createAttempt({ correct: true, hintsUsed: 1 }) // neutral
    ]
    const result = calculateDifficultyStreaks(attempts)
    expect(result.correctStreak).toBe(1)
  })

  it('breaks streak on wrong answer', () => {
    const attempts = [
      createAttempt({ correct: true, hintsUsed: 0 }),
      createAttempt({ correct: false, hintsUsed: 0 }) // neutral
    ]
    const result = calculateDifficultyStreaks(attempts)
    expect(result.correctStreak).toBe(1)
  })

  it('processes attempts backwards (most recent first)', () => {
    const attempts = [
      createAttempt({ skipped: true, timestamp: 1000 }), // oldest
      createAttempt({ skipped: true, timestamp: 2000 }),
      createAttempt({ correct: true, hintsUsed: 0, timestamp: 3000 }) // most recent
    ]
    const result = calculateDifficultyStreaks(attempts)
    expect(result.correctStreak).toBe(1)
    expect(result.incorrectStreak).toBe(0)
  })
})
