# Concept Star Rating Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Display 0-5 star mastery ratings on concept cards based on last 100 attempts.

**Architecture:** Create reusable star calculation utility and visual component, integrate into existing ConceptCard with progress data from useProgress hook.

**Tech Stack:** React, TypeScript, Tailwind CSS, existing progress tracking system

---

## Task 1: Create Star Calculation Utility

**Files:**
- Create: `packages/frontend/src/data/progress/mastery.ts`
- Create: `packages/frontend/src/data/progress/mastery.test.ts`

**Step 1: Write the failing test**

Create test file: `packages/frontend/src/data/progress/mastery.test.ts`

```typescript
import { describe, it, expect } from 'vitest'
import { calculateConceptStars } from './mastery'
import { ConceptStats, AttemptData } from './types'

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
      aggregate: {} as any
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
    const stats: ConceptStats = { attempts, aggregate: {} as any }
    expect(calculateConceptStars(stats)).toBe(1)
  })

  it('returns 2 stars for 50% success rate', () => {
    const attempts = [
      createAttempt(true),
      createAttempt(true),
      createAttempt(false),
      createAttempt(false)
    ]
    const stats: ConceptStats = { attempts, aggregate: {} as any }
    expect(calculateConceptStars(stats)).toBe(2)
  })

  it('returns 3 stars for 70% success rate', () => {
    const attempts = Array(10).fill(null).map((_, i) => createAttempt(i < 7))
    const stats: ConceptStats = { attempts, aggregate: {} as any }
    expect(calculateConceptStars(stats)).toBe(3)
  })

  it('returns 4 stars for 85% success rate', () => {
    const attempts = Array(20).fill(null).map((_, i) => createAttempt(i < 17))
    const stats: ConceptStats = { attempts, aggregate: {} as any }
    expect(calculateConceptStars(stats)).toBe(4)
  })

  it('returns 5 stars for 90%+ success rate', () => {
    const attempts = Array(20).fill(null).map((_, i) => createAttempt(i < 19))
    const stats: ConceptStats = { attempts, aggregate: {} as any }
    expect(calculateConceptStars(stats)).toBe(5)
  })

  it('uses only last 100 attempts', () => {
    const attempts = [
      ...Array(50).fill(null).map(() => createAttempt(false)), // Old bad attempts
      ...Array(100).fill(null).map((_, i) => createAttempt(i < 90)) // Recent 90% success
    ]
    const stats: ConceptStats = { attempts, aggregate: {} as any }
    expect(calculateConceptStars(stats)).toBe(5)
  })

  it('excludes skipped attempts from calculation', () => {
    const attempts = [
      createAttempt(true),
      { ...createAttempt(false), correct: null, skipped: true },
      { ...createAttempt(false), correct: null, skipped: true },
      createAttempt(true)
    ]
    const stats: ConceptStats = { attempts, aggregate: {} as any }
    // 2 correct out of 2 scored = 100% = 5 stars
    expect(calculateConceptStars(stats)).toBe(5)
  })

  it('returns 0 stars if all attempts are skipped', () => {
    const attempts = [
      { ...createAttempt(false), correct: null, skipped: true },
      { ...createAttempt(false), correct: null, skipped: true }
    ]
    const stats: ConceptStats = { attempts, aggregate: {} as any }
    expect(calculateConceptStars(stats)).toBe(0)
  })
})
```

**Step 2: Run test to verify it fails**

Run from project root:
```bash
docker compose exec frontend-dev bun test packages/frontend/src/data/progress/mastery.test.ts
```

Expected: FAIL with "Cannot find module './mastery'"

**Step 3: Write minimal implementation**

Create file: `packages/frontend/src/data/progress/mastery.ts`

```typescript
import { ConceptStats } from './types'

/**
 * Calculate 0-5 star mastery rating for a concept based on recent performance.
 * Uses last 100 attempts with "Encouraging Growth" thresholds.
 *
 * @param conceptStats - Concept statistics including attempt history
 * @returns Star rating from 0-5
 */
export function calculateConceptStars(conceptStats: ConceptStats | undefined): number {
  if (!conceptStats || conceptStats.attempts.length === 0) {
    return 0
  }

  // Take last 100 attempts
  const recentAttempts = conceptStats.attempts.slice(-100)

  // Filter out skipped attempts (correct = null)
  const scoredAttempts = recentAttempts.filter(a => a.correct !== null)

  if (scoredAttempts.length === 0) {
    return 0
  }

  // Calculate success rate
  const correct = scoredAttempts.filter(a => a.correct === true).length
  const successRate = correct / scoredAttempts.length

  // Map to stars using Encouraging Growth thresholds
  if (successRate === 0) return 0
  if (successRate < 0.4) return 1
  if (successRate < 0.6) return 2
  if (successRate < 0.8) return 3
  if (successRate < 0.9) return 4
  return 5
}
```

**Step 4: Run test to verify it passes**

Run:
```bash
docker compose exec frontend-dev bun test packages/frontend/src/data/progress/mastery.test.ts
```

Expected: All tests PASS (11 passing)

**Step 5: Commit**

```bash
git add packages/frontend/src/data/progress/mastery.ts packages/frontend/src/data/progress/mastery.test.ts
git commit -m "feat: add concept star rating calculation utility

Calculates 0-5 star mastery rating based on last 100 attempts
using Encouraging Growth thresholds. Filters skipped attempts.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 2: Create StarRating Component

**Files:**
- Create: `packages/frontend/src/components/ui/star-rating.tsx`

**Step 1: Write the component**

Create file: `packages/frontend/src/components/ui/star-rating.tsx`

```typescript
interface StarRatingProps {
  stars: number // 0-5
  size?: 'sm' | 'md' | 'lg'
}

export function StarRating({ stars, size = 'md' }: StarRatingProps) {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-base',
    lg: 'text-xl'
  }

  const clampedStars = Math.max(0, Math.min(5, Math.round(stars)))

  return (
    <div
      className={`flex gap-0.5 ${sizeClasses[size]}`}
      aria-label={`Mastery: ${clampedStars} out of 5 stars`}
      role="img"
    >
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={i < clampedStars ? 'text-yellow-500' : 'text-gray-300'}
          aria-hidden="true"
        >
          {i < clampedStars ? '★' : '☆'}
        </span>
      ))}
    </div>
  )
}
```

**Step 2: Manual verification**

Since this is a purely visual component, manual testing is appropriate. The component will be verified when integrated into ConceptCard.

**Step 3: Commit**

```bash
git add packages/frontend/src/components/ui/star-rating.tsx
git commit -m "feat: add StarRating component for mastery display

Reusable component showing 0-5 stars with size variants.
Includes accessibility labels and clamping for safety.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 3: Integrate Star Rating into ConceptCard

**Files:**
- Modify: `packages/frontend/src/app/concepts/ConceptCard.tsx`

**Step 1: Add imports and calculate stars**

Modify `packages/frontend/src/app/concepts/ConceptCard.tsx`:

```typescript
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Concept } from './types'
import { getSubjectNamespace } from '@/i18n/subjectNamespace'
import { useProgress } from '@/data/progress/hooks'
import { calculateConceptStars } from '@/data/progress/mastery'
import { StarRating } from '@/components/ui/star-rating'

const difficultyColors: Record<string, string> = {
  easy: 'bg-green-50 text-green-700',
  medium: 'bg-amber-50 text-amber-700',
  hard: 'bg-red-50 text-red-700',
}

export interface ConceptCardProps {
  concept: Concept
  subject: string
  isAdvanced?: boolean
}

export function ConceptCard({ concept, subject, isAdvanced }: ConceptCardProps) {
  const { t } = useTranslation()
  const namespace = getSubjectNamespace(subject, concept.grade)
  const { progress } = useProgress()

  // Calculate mastery stars
  const conceptStats = progress?.[subject]?.[concept.id]
  const masteryStars = calculateConceptStars(conceptStats)

  // Get translated values with fallback to backend data
  const name = t(`${namespace}:concepts.${concept.id}.name`, { defaultValue: concept.name })
  const description = t(`${namespace}:concepts.${concept.id}.description`, { defaultValue: concept.description })

  return (
    <Link to={`/subjects/${subject}/${concept.id}/tasks`}>
      <Card className={`relative bg-card shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer h-full rounded-2xl hover:-translate-y-1 ${
        isAdvanced ? 'ring-2 ring-orange-300 bg-orange-50/20' : ''
      }`}>
        {/* Star rating in top-right corner */}
        <div className="absolute top-4 right-4">
          <StarRating stars={masteryStars} size="md" />
        </div>

        <CardContent className="p-8 flex flex-col h-full">
          <h3 className="text-xl font-bold text-card-foreground mb-3">
            {name}
          </h3>

          <p className="text-muted-foreground mb-4 flex-1">{description}</p>

          <div className="flex flex-wrap gap-2">
            {concept.grade && (
              <Badge className="bg-blue-100 text-blue-800 rounded-lg pointer-events-none">
                {t('concepts.gradeLabel', { grade: concept.grade, defaultValue: `Grade ${concept.grade}` })}
              </Badge>
            )}
            {isAdvanced && (
              <Badge className="bg-orange-100 text-orange-800 rounded-lg pointer-events-none">
                {t('concepts.advanced')}
              </Badge>
            )}
            {concept.difficulty && (
              <Badge className={`rounded-lg pointer-events-none ${difficultyColors[concept.difficulty]}`}>
                {t(`difficulty.${concept.difficulty}`)}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
```

**Step 2: Visual verification**

Run the frontend to verify:
```bash
docker compose up frontend-dev
```

Navigate to: http://localhost:5153/subjects

Expected:
- Concept cards show star ratings in top-right corner
- Untried concepts show 0 stars (☆☆☆☆☆)
- Concepts with attempts show 1-5 stars based on performance
- Stars are yellow (filled) or gray (empty)
- Cards remain properly styled with stars not interfering with content

**Step 3: Commit**

```bash
git add packages/frontend/src/app/concepts/ConceptCard.tsx
git commit -m "feat: add star ratings to concept cards

Display 0-5 star mastery ratings in top-right corner of each
concept card based on last 100 attempts. Integrates with existing
progress tracking system.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Verification Checklist

After completing all tasks, verify:

- [ ] All tests pass: `docker compose exec frontend-dev bun test`
- [ ] Frontend builds: `docker compose exec frontend-dev bun run build`
- [ ] Visual check: Stars appear on concept cards
- [ ] Edge case: Untried concepts show 0 stars
- [ ] Edge case: Low success rate shows 1-2 stars
- [ ] Edge case: High success rate shows 4-5 stars
- [ ] Accessibility: Screen readers announce star count
- [ ] No console errors in browser
- [ ] Stars don't interfere with card layout
- [ ] Works across different time themes

---

## Notes

- **TDD approach:** Task 1 follows TDD strictly with comprehensive tests
- **Component task:** Task 2 is visual, manual testing appropriate
- **Integration task:** Task 3 integrates existing pieces, visual verification
- **No breaking changes:** All changes are additive, no existing functionality modified
- **Performance:** Calculation is lightweight, no memoization needed
