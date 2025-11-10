# Concept Star Rating Design

**Date:** 2025-11-10
**Status:** Approved

## Overview

Add visual star ratings (0-5 stars) to concept cards showing student mastery level based on recent performance. Stars provide immediate visual feedback on which concepts are mastered vs. need more practice.

## Purpose

Display mastery level for each concept to help students:
- Quickly identify strong vs. weak concepts
- Feel motivated by visible progress
- Make informed decisions about what to practice

## Design Decisions

### Visual Metaphor
**Stars (0-5)** - Classic, intuitive rating system (★★★☆☆)

### Calculation Method
**Success rate from last 100 attempts** with encouraging thresholds:
- 0% correct → 0★
- >0-40% → 1★
- 40-60% → 2★
- 60-80% → 3★
- 80-90% → 4★
- 90%+ → 5★

**Rationale:**
- Last 100 attempts (not time-based window) ensures fair comparison between active/casual users
- Reflects current ability, not lifetime stats
- "Encouraging Growth" thresholds motivate younger students
- Simpler than weighted scores (no speed/hint factors)

### Display Rules
- Always show stars, even for untried concepts (0 stars = ☆☆☆☆☆)
- Immediate feedback after first attempt
- No minimum attempt threshold required

### Placement
Top-right corner of ConceptCard as floating badge
- Visually prominent and scannable
- Doesn't compete with metadata badges (grade/difficulty)
- Consistent position across all cards

## Architecture

### Data Flow
```
ConceptCard (props: concept)
  ↓
useProgress() hook → progress data
  ↓
calculateConceptStars(conceptStats) → 0-5 stars
  ↓
<StarRating stars={n} /> → visual display
```

### Components

#### 1. Utility Function
**File:** `/packages/frontend/src/data/progress/mastery.ts`

```typescript
export function calculateConceptStars(conceptStats: ConceptStats | undefined): number {
  if (!conceptStats || conceptStats.attempts.length === 0) {
    return 0
  }

  // Take last 100 attempts
  const recentAttempts = conceptStats.attempts.slice(-100)

  // Filter out skipped attempts (correct = null)
  const scoredAttempts = recentAttempts.filter(a => a.correct !== null)

  if (scoredAttempts.length === 0) return 0

  // Calculate success rate
  const correct = scoredAttempts.filter(a => a.correct === true).length
  const successRate = correct / scoredAttempts.length

  // Map to stars (Encouraging Growth thresholds)
  if (successRate === 0) return 0
  if (successRate < 0.4) return 1
  if (successRate < 0.6) return 2
  if (successRate < 0.8) return 3
  if (successRate < 0.9) return 4
  return 5
}
```

#### 2. Visual Component
**File:** `/packages/frontend/src/components/ui/star-rating.tsx`

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

  return (
    <div
      className={`flex gap-0.5 ${sizeClasses[size]}`}
      aria-label={`Mastery: ${stars} out of 5 stars`}
    >
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={i < stars ? 'text-yellow-500' : 'text-gray-300'}
        >
          {i < stars ? '★' : '☆'}
        </span>
      ))}
    </div>
  )
}
```

#### 3. ConceptCard Integration
**File:** `/packages/frontend/src/app/concepts/ConceptCard.tsx`

```typescript
import { useProgress } from '@/data/progress/hooks'
import { calculateConceptStars } from '@/data/progress/mastery'
import { StarRating } from '@/components/ui/star-rating'

export function ConceptCard({ concept, subject, isAdvanced }: ConceptCardProps) {
  const { progress } = useProgress()
  const conceptStats = progress?.[subject]?.[concept.id]
  const masteryStars = calculateConceptStars(conceptStats)

  return (
    <Card className="relative ...">
      <div className="absolute top-4 right-4">
        <StarRating stars={masteryStars} size="md" />
      </div>
      <CardContent>
        {/* existing content */}
      </CardContent>
    </Card>
  )
}
```

## Edge Cases

| Case | Behavior |
|------|----------|
| No progress data | Show 0 stars |
| No attempts for concept | Show 0 stars (☆☆☆☆☆) |
| <100 attempts available | Use all available attempts |
| Only skipped attempts | Show 0 stars (no scored attempts) |
| Progress loading | Optional chaining handles undefined gracefully |

## Visual Design

### Colors
- Filled stars: `text-yellow-500` (fixed, not adaptive to time themes)
- Empty stars: `text-gray-300`

### Sizing
- Small (sm): 12px - for compact displays
- Medium (md): 16px - default for ConceptCard
- Large (lg): 20px - for emphasis

### Accessibility
- `aria-label` announces rating to screen readers
- Stars are enhancement, not critical information
- Visual feedback supplemented by existing text

## Performance

- Calculation is lightweight (max 100 item array operations)
- No API calls - all client-side
- No memoization needed at this scale

## Future Enhancements

Potential future improvements (not in scope):
- Tooltip showing exact success rate percentage on hover
- Breakdown by difficulty level within concept
- Animation when stars increase
- Export stars data for analytics
