import { describe, it, expect } from 'vitest'
import { useDifficultyTracking } from '../useDifficultyTracking'

describe('useDifficultyTracking', () => {
  it('exports useDifficultyTracking hook', () => {
    expect(useDifficultyTracking).toBeDefined()
    expect(typeof useDifficultyTracking).toBe('function')
  })

  it('hook name is correct', () => {
    expect(useDifficultyTracking.name).toBe('useDifficultyTracking')
  })
})
