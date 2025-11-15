# Adaptive Difficulty System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add per-concept adaptive difficulty that automatically adjusts based on student performance with prominent visual feedback.

**Architecture:** Extend ConceptStats with difficulty field, calculate streaks from existing attempts data, hook into task completion flow, display animated banner on difficulty changes.

**Tech Stack:** React 18, TypeScript, TailwindCSS, existing userData system (no backend changes needed)

---

## Task 1: Update Data Types and Add Difficulty Field

**Files:**
- Modify: `packages/frontend/src/data/progress/types.ts:39-45`

**Step 1: Add difficulty field to ConceptStats interface**

Locate the `ConceptStats` interface and add the optional `difficulty` field:

```typescript
export interface ConceptStats {
  /** List of all attempts for this concept */
  attempts: AttemptData[]

  /** Cached aggregate stats (recalculated on data load/save) */
  aggregate: ConceptAggregate

  /** Current adaptive difficulty level for this concept (defaults to "medium") */
  difficulty?: Difficulty
}
```

**Step 2: Verify TypeScript compiles**

Run: `cd packages/frontend && bunx tsc --noEmit`
Expected: No errors (this is a non-breaking change due to optional field)

**Step 3: Commit**

```bash
git add packages/frontend/src/data/progress/types.ts
git commit -m "feat(types): add difficulty field to ConceptStats"
```

---

## Task 2: Create Streak Calculation Utility

**Files:**
- Modify: `packages/frontend/src/data/progress/aggregation.ts` (add new function at end)
- Create: `packages/frontend/src/data/progress/__tests__/aggregation.test.ts` (if doesn't exist)

**Step 1: Write failing test for streak calculation**

Create or modify test file with these test cases:

```typescript
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
```

**Step 2: Run test to verify it fails**

Run: `cd packages/frontend && bun test aggregation.test.ts`
Expected: FAIL with "calculateDifficultyStreaks is not defined"

**Step 3: Implement streak calculation function**

Add to `packages/frontend/src/data/progress/aggregation.ts`:

```typescript
export function calculateDifficultyStreaks(attempts: AttemptData[]): {
  correctStreak: number
  incorrectStreak: number
} {
  let correctStreak = 0
  let incorrectStreak = 0

  // Iterate backwards through attempts (most recent first)
  for (let i = attempts.length - 1; i >= 0; i--) {
    const attempt = attempts[i]

    // First-try correct: correct answer with zero hints, not skipped
    const isFirstTryCorrect = attempt.correct && attempt.hintsUsed === 0 && !attempt.skipped

    // Skipped: student gave up on the task
    const isSkipped = attempt.skipped

    // Eventually correct or wrong with hints: neutral (breaks streak)
    const isNeutral = !isFirstTryCorrect && !isSkipped

    if (isFirstTryCorrect) {
      correctStreak++
      if (incorrectStreak > 0) break // Streaks are mutually exclusive
    } else if (isSkipped) {
      incorrectStreak++
      if (correctStreak > 0) break
    } else {
      // Neutral attempt breaks both streaks
      break
    }
  }

  return { correctStreak, incorrectStreak }
}
```

**Step 4: Run test to verify it passes**

Run: `cd packages/frontend && bun test aggregation.test.ts`
Expected: All tests PASS

**Step 5: Commit**

```bash
git add packages/frontend/src/data/progress/aggregation.ts packages/frontend/src/data/progress/__tests__/aggregation.test.ts
git commit -m "feat(progress): add difficulty streak calculation from attempts"
```

---

## Task 3: Create Difficulty Adjustment Logic

**Files:**
- Create: `packages/frontend/src/data/progress/difficultyAdjuster.ts`
- Create: `packages/frontend/src/data/progress/__tests__/difficultyAdjuster.test.ts`

**Step 1: Write failing test for difficulty adjustment**

Create test file:

```typescript
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
```

**Step 2: Run test to verify it fails**

Run: `cd packages/frontend && bun test difficultyAdjuster.test.ts`
Expected: FAIL with "adjustDifficulty is not defined"

**Step 3: Implement difficulty adjuster**

Create `packages/frontend/src/data/progress/difficultyAdjuster.ts`:

```typescript
import { ConceptStats, Difficulty } from './types'
import { calculateDifficultyStreaks } from './aggregation'

export type DifficultyNotification = {
  type: 'level_up' | 'level_down' | 'achievement'
  message: string
  newDifficulty: Difficulty
} | null

export function adjustDifficulty(
  conceptStats: ConceptStats
): { newDifficulty: Difficulty; notification: DifficultyNotification } {
  const { correctStreak, incorrectStreak } = calculateDifficultyStreaks(conceptStats.attempts)
  const currentDifficulty = conceptStats.difficulty || 'medium'

  let newDifficulty = currentDifficulty
  let notification: DifficultyNotification = null

  // Check for level up (3 consecutive first-try-correct)
  if (correctStreak >= 3) {
    if (currentDifficulty === 'easy') {
      newDifficulty = 'medium'
      notification = {
        type: 'level_up',
        message: "You've leveled up to Medium!",
        newDifficulty: 'medium'
      }
    } else if (currentDifficulty === 'medium') {
      newDifficulty = 'hard'
      notification = {
        type: 'level_up',
        message: "You've leveled up to Hard!",
        newDifficulty: 'hard'
      }
    } else {
      // Already at hard
      notification = {
        type: 'achievement',
        message: "Mastering hard level! Keep it up!",
        newDifficulty: 'hard'
      }
    }
  }

  // Check for level down (2 consecutive skips)
  if (incorrectStreak >= 2) {
    if (currentDifficulty === 'hard') {
      newDifficulty = 'medium'
      notification = {
        type: 'level_down',
        message: "Back to Medium - you've got this!",
        newDifficulty: 'medium'
      }
    } else if (currentDifficulty === 'medium') {
      newDifficulty = 'easy'
      notification = {
        type: 'level_down',
        message: "Back to Easy - practice makes perfect!",
        newDifficulty: 'easy'
      }
    } else {
      // Already at easy
      notification = {
        type: 'achievement',
        message: "Keep practicing - you're learning!",
        newDifficulty: 'easy'
      }
    }
  }

  return { newDifficulty, notification }
}
```

**Step 4: Run test to verify it passes**

Run: `cd packages/frontend && bun test difficultyAdjuster.test.ts`
Expected: All tests PASS

**Step 5: Commit**

```bash
git add packages/frontend/src/data/progress/difficultyAdjuster.ts packages/frontend/src/data/progress/__tests__/difficultyAdjuster.test.ts
git commit -m "feat(progress): add difficulty adjustment logic with thresholds"
```

---

## Task 4: Create DifficultyBanner Component

**Files:**
- Create: `packages/frontend/src/components/DifficultyBanner.tsx`
- Create: `packages/frontend/src/components/__tests__/DifficultyBanner.test.tsx`

**Step 1: Write test for banner component**

Create test file:

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DifficultyBanner } from '../DifficultyBanner'

describe('DifficultyBanner', () => {
  it('renders level up notification', () => {
    const notification = {
      type: 'level_up' as const,
      message: "You've leveled up to Hard!",
      newDifficulty: 'hard' as const
    }
    render(<DifficultyBanner notification={notification} onDismiss={() => {}} />)
    expect(screen.getByText(/leveled up to Hard/i)).toBeInTheDocument()
  })

  it('renders level down notification', () => {
    const notification = {
      type: 'level_down' as const,
      message: "Back to Medium - you've got this!",
      newDifficulty: 'medium' as const
    }
    render(<DifficultyBanner notification={notification} onDismiss={() => {}} />)
    expect(screen.getByText(/Back to Medium/i)).toBeInTheDocument()
  })

  it('renders achievement notification', () => {
    const notification = {
      type: 'achievement' as const,
      message: "Mastering hard level! Keep it up!",
      newDifficulty: 'hard' as const
    }
    render(<DifficultyBanner notification={notification} onDismiss={() => {}} />)
    expect(screen.getByText(/Mastering/i)).toBeInTheDocument()
  })

  it('calls onDismiss when clicked', async () => {
    const onDismiss = vi.fn()
    const notification = {
      type: 'level_up' as const,
      message: "Test message",
      newDifficulty: 'medium' as const
    }
    render(<DifficultyBanner notification={notification} onDismiss={onDismiss} />)

    const banner = screen.getByRole('button')
    await userEvent.click(banner)

    expect(onDismiss).toHaveBeenCalled()
  })

  it('auto-dismisses after 4 seconds', async () => {
    vi.useFakeTimers()
    const onDismiss = vi.fn()
    const notification = {
      type: 'level_up' as const,
      message: "Test message",
      newDifficulty: 'medium' as const
    }
    render(<DifficultyBanner notification={notification} onDismiss={onDismiss} />)

    vi.advanceTimersByTime(4000)
    await waitFor(() => expect(onDismiss).toHaveBeenCalled())

    vi.useRealTimers()
  })

  it('does not render when notification is null', () => {
    const { container } = render(<DifficultyBanner notification={null} onDismiss={() => {}} />)
    expect(container.firstChild).toBeNull()
  })
})
```

**Step 2: Run test to verify it fails**

Run: `cd packages/frontend && bun test DifficultyBanner.test.tsx`
Expected: FAIL with "DifficultyBanner is not defined"

**Step 3: Implement DifficultyBanner component**

Create `packages/frontend/src/components/DifficultyBanner.tsx`:

```typescript
import { useEffect } from 'react'
import { DifficultyNotification } from '@/data/progress/difficultyAdjuster'
import { cn } from '@/lib/utils'

interface DifficultyBannerProps {
  notification: DifficultyNotification
  onDismiss: () => void
}

export function DifficultyBanner({ notification, onDismiss }: DifficultyBannerProps) {
  useEffect(() => {
    if (!notification) return

    const timer = setTimeout(() => {
      onDismiss()
    }, 4000)

    return () => clearTimeout(timer)
  }, [notification, onDismiss])

  if (!notification) return null

  const styles = {
    level_up: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white',
    level_down: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white',
    achievement: 'bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900'
  }

  const icons = {
    level_up: '↑',
    level_down: '↓',
    achievement: '★'
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 animate-slide-down">
      <button
        onClick={onDismiss}
        className={cn(
          'w-full px-6 py-4 flex items-center justify-center gap-3 shadow-lg',
          'transition-all duration-300 hover:opacity-90',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          styles[notification.type]
        )}
        role="button"
        aria-label="Dismiss notification"
      >
        <span className="text-3xl" aria-hidden="true">
          {icons[notification.type]}
        </span>
        <span className="text-lg font-semibold">
          {notification.message}
        </span>
      </button>
    </div>
  )
}
```

**Step 4: Add animation to tailwind config**

Modify `packages/frontend/tailwind.config.js` to add the slide-down animation:

```javascript
// Add to theme.extend.keyframes:
keyframes: {
  'slide-down': {
    '0%': { transform: 'translateY(-100%)' },
    '100%': { transform: 'translateY(0)' }
  }
}

// Add to theme.extend.animation:
animation: {
  'slide-down': 'slide-down 0.3s ease-out'
}
```

**Step 5: Run test to verify it passes**

Run: `cd packages/frontend && bun test DifficultyBanner.test.tsx`
Expected: All tests PASS

**Step 6: Commit**

```bash
git add packages/frontend/src/components/DifficultyBanner.tsx packages/frontend/src/components/__tests__/DifficultyBanner.test.tsx packages/frontend/tailwind.config.js
git commit -m "feat(ui): add DifficultyBanner component with animations"
```

---

## Task 5: Create useDifficultyTracking Hook

**Files:**
- Create: `packages/frontend/src/hooks/useDifficultyTracking.ts`
- Create: `packages/frontend/src/hooks/__tests__/useDifficultyTracking.test.ts`

**Step 1: Write test for hook**

Create test file:

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDifficultyTracking } from '../useDifficultyTracking'

// Mock userData context
vi.mock('@/data/core/userData', () => ({
  useUserData: () => ({
    data: {
      progress: {
        math: {
          algebra: {
            attempts: [],
            aggregate: {},
            difficulty: 'medium'
          }
        }
      }
    },
    setData: vi.fn()
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
```

**Step 2: Run test to verify it fails**

Run: `cd packages/frontend && bun test useDifficultyTracking.test.ts`
Expected: FAIL with "useDifficultyTracking is not defined"

**Step 3: Implement hook**

Create `packages/frontend/src/hooks/useDifficultyTracking.ts`:

```typescript
import { useState, useCallback, useMemo } from 'react'
import { useUserData } from '@/data/core/userData'
import { adjustDifficulty, DifficultyNotification } from '@/data/progress/difficultyAdjuster'
import { Difficulty } from '@/data/progress/types'

export function useDifficultyTracking(subject: string, conceptId: string) {
  const { data: userData, setData } = useUserData()
  const [notification, setNotification] = useState<DifficultyNotification>(null)

  // Get current concept stats
  const conceptStats = useMemo(() => {
    return userData?.progress?.[subject]?.[conceptId]
  }, [userData, subject, conceptId])

  // Get current difficulty (default to medium)
  const currentDifficulty: Difficulty = conceptStats?.difficulty || 'medium'

  // Check if difficulty should adjust and update if needed
  const checkAndAdjustDifficulty = useCallback(() => {
    if (!conceptStats || !userData) return

    const { newDifficulty, notification: adjustmentNotification } = adjustDifficulty(conceptStats)

    if (adjustmentNotification) {
      setNotification(adjustmentNotification)

      // Update difficulty in userData if it changed
      if (newDifficulty !== currentDifficulty) {
        const updatedUserData = { ...userData }
        if (!updatedUserData.progress[subject]) {
          updatedUserData.progress[subject] = {}
        }
        if (!updatedUserData.progress[subject][conceptId]) {
          updatedUserData.progress[subject][conceptId] = {
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
        }
        updatedUserData.progress[subject][conceptId].difficulty = newDifficulty
        setData(updatedUserData)
      }
    }
  }, [conceptStats, userData, currentDifficulty, subject, conceptId, setData])

  const dismissNotification = useCallback(() => {
    setNotification(null)
  }, [])

  return {
    currentDifficulty,
    notification,
    checkAndAdjustDifficulty,
    dismissNotification
  }
}
```

**Step 4: Run test to verify it passes**

Run: `cd packages/frontend && bun test useDifficultyTracking.test.ts`
Expected: All tests PASS (may need to adjust mocks)

**Step 5: Commit**

```bash
git add packages/frontend/src/hooks/useDifficultyTracking.ts packages/frontend/src/hooks/__tests__/useDifficultyTracking.test.ts
git commit -m "feat(hooks): add useDifficultyTracking hook"
```

---

## Task 6: Integrate into PracticePage

**Files:**
- Modify: `packages/frontend/src/app/practice/PracticePage.tsx`

**Step 1: Import dependencies**

Add imports at top of file:

```typescript
import { useDifficultyTracking } from '@/hooks/useDifficultyTracking'
import { DifficultyBanner } from '@/components/DifficultyBanner'
```

**Step 2: Add hook inside component**

Inside the `PracticePage` component function, after existing hooks:

```typescript
const {
  currentDifficulty,
  notification,
  checkAndAdjustDifficulty,
  dismissNotification
} = useDifficultyTracking(subject, concept)
```

**Step 3: Update task request to use currentDifficulty**

Find where the task is requested (likely in a `useQuery` or `useEffect`), and update the difficulty parameter:

```typescript
// Before:
const { data: task } = useTask({ subject, concept, difficulty: 'medium', ... })

// After:
const { data: task } = useTask({ subject, concept, difficulty: currentDifficulty, ... })
```

**Step 4: Call checkAndAdjustDifficulty after task completion**

Find where `addAttempt` is called (task submission handler), and add the check after:

```typescript
// After addAttempt call:
addAttempt(progress, gameStats, submissionData)

// Add this:
checkAndAdjustDifficulty()
```

**Step 5: Render DifficultyBanner**

Add the banner component at the top of the return JSX:

```typescript
return (
  <div className="practice-page">
    <DifficultyBanner notification={notification} onDismiss={dismissNotification} />

    {/* existing content */}
  </div>
)
```

**Step 6: Test manually in browser**

Run: `cd packages/frontend && bun run dev`
Open browser and test:
1. Complete 3 tasks correctly on first try → should see level up banner
2. Skip 2 tasks → should see level down banner
3. Banner auto-dismisses after 4s
4. Can click to dismiss early

**Step 7: Commit**

```bash
git add packages/frontend/src/app/practice/PracticePage.tsx
git commit -m "feat(practice): integrate adaptive difficulty with visual feedback"
```

---

## Task 7: Add Internationalization for Banner Messages

**Files:**
- Modify: `packages/frontend/src/i18n/locales/en.json`
- Modify: `packages/frontend/src/i18n/locales/de.json`
- Modify: `packages/frontend/src/data/progress/difficultyAdjuster.ts`

**Step 1: Add translation keys to English locale**

Add to `packages/frontend/src/i18n/locales/en.json`:

```json
{
  "difficulty": {
    "levelUp": {
      "medium": "You've leveled up to Medium!",
      "hard": "You've leveled up to Hard!"
    },
    "levelDown": {
      "medium": "Back to Medium - you've got this!",
      "easy": "Back to Easy - practice makes perfect!"
    },
    "achievement": {
      "masteringHard": "Mastering hard level! Keep it up!",
      "practicingEasy": "Keep practicing - you're learning!"
    }
  }
}
```

**Step 2: Add translation keys to German locale**

Add to `packages/frontend/src/i18n/locales/de.json`:

```json
{
  "difficulty": {
    "levelUp": {
      "medium": "Du hast Mittel erreicht!",
      "hard": "Du hast Schwer erreicht!"
    },
    "levelDown": {
      "medium": "Zurück zu Mittel - du schaffst das!",
      "easy": "Zurück zu Leicht - Übung macht den Meister!"
    },
    "achievement": {
      "masteringHard": "Du meisterst das schwere Level!",
      "practicingEasy": "Weiter üben - du lernst!"
    }
  }
}
```

**Step 3: Update difficultyAdjuster to use i18n**

Modify imports in `difficultyAdjuster.ts`:

```typescript
import { t } from 'i18next'
```

Update messages to use translation keys:

```typescript
// Level up easy → medium:
message: t('difficulty.levelUp.medium')

// Level up medium → hard:
message: t('difficulty.levelUp.hard')

// Level down hard → medium:
message: t('difficulty.levelDown.medium')

// Level down medium → easy:
message: t('difficulty.levelDown.easy')

// Achievement at hard:
message: t('difficulty.achievement.masteringHard')

// Achievement at easy:
message: t('difficulty.achievement.practicingEasy')
```

**Step 4: Test in both languages**

Run app and switch language setting to verify translations work.

**Step 5: Commit**

```bash
git add packages/frontend/src/i18n/locales/en.json packages/frontend/src/i18n/locales/de.json packages/frontend/src/data/progress/difficultyAdjuster.ts
git commit -m "feat(i18n): add translations for difficulty notifications"
```

---

## Task 8: Final Integration Testing

**Files:**
- None (manual testing)

**Step 1: Test full user journey**

Scenarios to test:
1. New user starts at medium difficulty
2. Gets 3 correct on first try → levels up to hard
3. Skips 2 tasks → levels back down to medium
4. At hard, gets 3 correct → sees achievement message
5. At easy, skips 2 → sees encouragement message
6. Switch between concepts → each has independent difficulty
7. Close browser and reopen → difficulty persists
8. Banner animations are smooth
9. Banner auto-dismisses after 4s
10. Can manually dismiss banner

**Step 2: Test cross-device sync**

1. Complete tasks on one device
2. Open on another device (or use export/import)
3. Verify difficulty synced correctly

**Step 3: Test edge cases**

1. Complete task with hints (eventually correct) → no streak change
2. Get wrong answer → no streak change
3. Mix of outcomes → streaks calculated correctly

**Step 4: Performance check**

1. Verify streak calculation is fast (< 10ms)
2. No UI lag when banner appears
3. Smooth animations at 60fps

**Step 5: Document findings**

If any issues found, create new tasks to fix them.

**Step 6: Final commit**

```bash
git add -A
git commit -m "test: verify adaptive difficulty integration"
```

---

## Verification Checklist

Before marking implementation complete, verify:

- [ ] TypeScript compiles with no errors
- [ ] All unit tests pass
- [ ] Streak calculation works correctly
- [ ] Difficulty adjusts at correct thresholds
- [ ] Banner displays for all notification types
- [ ] Banner auto-dismisses after 4 seconds
- [ ] Banner can be manually dismissed
- [ ] Translations work in English and German
- [ ] Difficulty persists across sessions
- [ ] Each concept has independent difficulty
- [ ] No backend changes required (verified)
- [ ] Data syncs to server automatically
- [ ] Export/import includes difficulty data
- [ ] Performance is acceptable

---

## Next Steps After Implementation

1. Monitor user feedback on difficulty adjustment feel
2. Consider adding difficulty history visualization
3. Consider per-age-group threshold customization
4. Add analytics to track difficulty distribution
5. Consider parent/teacher dashboard showing difficulty progression
