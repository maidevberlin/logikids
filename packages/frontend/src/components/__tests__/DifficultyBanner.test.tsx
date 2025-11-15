import { describe, it, expect } from 'vitest'
import { DifficultyBanner } from '../DifficultyBanner'

describe('DifficultyBanner', () => {
  it('exports DifficultyBanner component', () => {
    expect(DifficultyBanner).toBeDefined()
    expect(typeof DifficultyBanner).toBe('function')
  })

  it('component name is correct', () => {
    expect(DifficultyBanner.name).toBe('DifficultyBanner')
  })
})
