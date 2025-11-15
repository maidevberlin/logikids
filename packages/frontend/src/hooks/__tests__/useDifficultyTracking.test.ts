import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDifficultyTracking } from '../useDifficultyTracking'

// Mock userData context
vi.mock('@/app/account', () => ({
  useUserData: () => ({
    data: {
      progress: {
        math: {
          algebra: {
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
            },
            difficulty: 'medium'
          }
        }
      }
    },
    updateProgress: vi.fn()
  })
}))

describe('useDifficultyTracking', () => {
  it('returns current difficulty from concept stats', () => {
    const { result } = renderHook(() => useDifficultyTracking('math', 'algebra'))
    expect(result.current.currentDifficulty).toBe('medium')
  })

  it('defaults to medium when no difficulty set', () => {
    // Mock would need adjustment for this test
    const { result } = renderHook(() => useDifficultyTracking('math', 'new-concept'))
    expect(result.current.currentDifficulty).toBe('medium')
  })

  it('provides notification state', () => {
    const { result } = renderHook(() => useDifficultyTracking('math', 'algebra'))
    expect(result.current.notification).toBeNull()
  })

  it('provides checkAndAdjustDifficulty function', () => {
    const { result } = renderHook(() => useDifficultyTracking('math', 'algebra'))
    expect(typeof result.current.checkAndAdjustDifficulty).toBe('function')
  })

  it('provides dismissNotification function', () => {
    const { result } = renderHook(() => useDifficultyTracking('math', 'algebra'))
    expect(typeof result.current.dismissNotification).toBe('function')
  })
})
