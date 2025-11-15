# Adaptive Difficulty System - Design Document

**Date:** 2025-11-15
**Status:** Approved Design
**Author:** Claude Code (with stakeholder input)

## Overview

Add an adaptive difficulty adjustment system that automatically increases or decreases task difficulty based on student performance, with prominent visual feedback to encourage learning progress.

## Requirements Summary

### Core Functionality
- **Granularity:** Per-concept difficulty tracking (each concept in each subject maintains independent difficulty level)
- **Adjustment Logic:** Asymmetric thresholds (3 consecutive first-try-correct → level up, 2 consecutive skips → level down)
- **Visual Feedback:** Animated banner notification, shown immediately after triggering event, auto-dismisses after 4 seconds
- **Data Storage:** Integrated into existing encrypted UserData structure, automatically synced to server

### User Experience Goals
- **Encouraging:** Positive messaging even when difficulty decreases
- **Prominent:** Clear, visible feedback when difficulty changes
- **Non-blocking:** Banner doesn't interrupt task flow
- **Achievement-oriented:** Celebrate students at difficulty boundaries (mastering hard, practicing easy)

## Architecture

### 1. Data Model

#### Updated ConceptStats Interface
Location: `/packages/frontend/src/data/progress/types.ts`

```typescript
export interface ConceptStats {
  /** List of all attempts for this concept */
  attempts: AttemptData[]

  /** Cached aggregate stats (recalculated on data load/save) */
  aggregate: ConceptAggregate

  /** Current adaptive difficulty level for this concept */
  difficulty: Difficulty  // "easy" | "medium" | "hard" (defaults to "medium")
}
```

**Rationale:**
- Only `difficulty` field is persisted
- Streaks calculated on-the-fly from existing `attempts` array
- Avoids data redundancy and ensures single source of truth
- Leverages existing backup/sync infrastructure

#### Existing AttemptData (No Changes Needed)
```typescript
export interface AttemptData {
  id: string
  difficulty: Difficulty
  correct: boolean | null
  hintsUsed: number
  timeSeconds: number
  timestamp: number
  skipped: boolean  // Already tracked!
}
```

### 2. Streak Calculation Algorithm

Create new utility function in `/packages/frontend/src/data/progress/aggregation.ts`:

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
      if (incorrectStreak > 0) break  // Streaks are mutually exclusive
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

**Task Outcome Categories:**
- **First-try correct:** `correct=true, hintsUsed=0, skipped=false` → +1 correct streak
- **Eventually correct:** `correct=true, hintsUsed>0` → neutral (no streak change)
- **Skipped:** `skipped=true` → +1 incorrect streak
- **Wrong:** `correct=false, skipped=false` → neutral (no streak change)

### 3. Difficulty Adjustment Logic

Create new function in `/packages/frontend/src/data/progress/difficultyAdjuster.ts`:

```typescript
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

### 4. React Hook Integration

Create `/packages/frontend/src/hooks/useDifficultyTracking.ts`:

```typescript
export function useDifficultyTracking(subject: string, conceptId: string) {
  const [notification, setNotification] = useState<DifficultyNotification>(null)

  // Get current concept stats from userData
  const conceptStats = useConceptStats(subject, conceptId)
  const currentDifficulty = conceptStats?.difficulty || 'medium'

  // Called after task completion
  const checkAndAdjustDifficulty = useCallback(() => {
    if (!conceptStats) return

    const { newDifficulty, notification } = adjustDifficulty(conceptStats)

    if (notification) {
      setNotification(notification)

      // Update difficulty in userData if changed
      if (newDifficulty !== currentDifficulty) {
        updateConceptDifficulty(subject, conceptId, newDifficulty)
      }
    }
  }, [conceptStats, subject, conceptId, currentDifficulty])

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

### 5. UI Components

#### DifficultyBanner Component
Location: `/packages/frontend/src/components/DifficultyBanner.tsx`

**Visual Design:**
- **Position:** Top of screen, slides down from above
- **Duration:** 4 seconds auto-dismiss (or click to dismiss early)
- **Animation:** Slide-in 300ms, fade-out 200ms
- **Size:** Full-width banner, ~80px height

**Variants:**
1. **Level Up** (Green gradient)
   - Background: `bg-gradient-to-r from-green-500 to-emerald-600`
   - Icon: Upward arrow (↑) or trophy
   - Text color: White

2. **Level Down** (Blue/supportive gradient)
   - Background: `bg-gradient-to-r from-blue-500 to-indigo-600`
   - Icon: Downward arrow (↓) or star
   - Text color: White
   - **Note:** Avoid red/negative colors - use supportive blue tones

3. **Achievement** (Gold gradient)
   - Background: `bg-gradient-to-r from-yellow-400 to-amber-500`
   - Icon: Star (★) or medal
   - Text color: Dark gray/black for contrast

**Props:**
```typescript
interface DifficultyBannerProps {
  notification: DifficultyNotification
  onDismiss: () => void
}
```

#### Integration in PracticePage
Location: `/packages/frontend/src/app/practice/PracticePage.tsx`

**Integration Points:**
1. Initialize hook: `const { currentDifficulty, notification, checkAndAdjustDifficulty, dismissNotification } = useDifficultyTracking(subject, concept)`
2. Use `currentDifficulty` in task API request
3. After task submission (in `addAttempt` callback), call `checkAndAdjustDifficulty()`
4. Render `<DifficultyBanner>` at top of page when `notification !== null`

### 6. Data Flow

```
[User completes task]
    ↓
[addAttempt() called with correct/hintsUsed/skipped]
    ↓
[AttemptData added to conceptStats.attempts[]]
    ↓
[checkAndAdjustDifficulty() triggered]
    ↓
[calculateDifficultyStreaks() reads recent attempts]
    ↓
[adjustDifficulty() applies thresholds]
    ↓
[If threshold met: update difficulty, set notification]
    ↓
[DifficultyBanner renders with animation]
    ↓
[Auto-dismiss after 4s or user clicks]
    ↓
[Next task request uses new currentDifficulty]
```

### 7. Backend Integration

**No backend changes required!**

The existing API already supports difficulty parameter:
```
GET /api/task?subject=math&concept=algebra&difficulty=medium
```

The frontend simply passes the updated `currentDifficulty` value from the hook.

## Data Storage & Backup

### Automatic Integration with Existing Systems

✅ **Encrypted localStorage:** `difficulty` field automatically encrypted as part of UserData
✅ **Server sync:** Auto-syncs via existing `sync.ts` on window blur/focus/close
✅ **Export/Import:** Included in JSON export via `export.ts`
✅ **PostgreSQL backup:** Stored in encrypted `user_sync_data` table
✅ **Cross-device sync:** Last-write-wins conflict resolution applies

### Migration Strategy

**Graceful Defaults:**
- Existing `ConceptStats` without `difficulty` field → defaults to `"medium"`
- New concepts → default to `"medium"`
- Cleared browser data → all concepts reset to `"medium"` (acceptable)

**No migration script needed** - TypeScript optional property with runtime default.

## Testing Strategy

### Unit Tests

**Streak Calculation:**
- Empty attempts array → both streaks = 0
- 3 first-try-correct in a row → correctStreak = 3
- 2 skips in a row → incorrectStreak = 2
- Mixed sequence (correct, hint-used-correct, skip) → breaks at neutral
- Boundary: exactly 3 correct → level up, exactly 2 skips → level down

**Difficulty Adjustment:**
- Easy + 3 correct → Medium with level_up notification
- Medium + 3 correct → Hard with level_up notification
- Hard + 3 correct → Hard with achievement notification
- Hard + 2 skips → Medium with level_down notification
- Medium + 2 skips → Easy with level_down notification
- Easy + 2 skips → Easy with achievement notification

### Integration Tests

- Task completion flow triggers difficulty check
- Banner appears immediately after qualifying attempt
- Banner auto-dismisses after 4s
- Next task request uses updated difficulty
- Data persists to localStorage and syncs to server

### Manual Testing Checklist

- [ ] Complete 3 tasks first-try-correct → see level up banner
- [ ] Skip 2 tasks → see level down banner
- [ ] Level up at hard → see achievement banner
- [ ] Level down at easy → see achievement banner
- [ ] Switch between concepts → each maintains independent difficulty
- [ ] Close and reopen browser → difficulty persists
- [ ] Multiple tabs open → sync works correctly
- [ ] Export/import data → difficulty included

## Edge Cases

| Scenario | Behavior |
|----------|----------|
| New concept (no attempts) | Default to "medium", streaks = 0 |
| Existing data without difficulty field | Default to "medium" on first read |
| Student at "hard" gets 3 correct | Show achievement, no difficulty change |
| Student at "easy" skips 2 tasks | Show achievement, no difficulty change |
| Switching concepts mid-streak | Each concept has independent streaks |
| Concurrent tabs updating difficulty | Last-write-wins via sync (acceptable) |
| Browser data cleared | All concepts reset to "medium" (acceptable) |
| Import old data | Missing fields default gracefully |

## Implementation Checklist

### Phase 1: Data Layer
- [ ] Add `difficulty?: Difficulty` to `ConceptStats` interface
- [ ] Create `calculateDifficultyStreaks()` utility function
- [ ] Create `adjustDifficulty()` function with threshold logic
- [ ] Add unit tests for streak calculation
- [ ] Add unit tests for difficulty adjustment

### Phase 2: React Hook
- [ ] Create `useDifficultyTracking` hook
- [ ] Integrate with existing `userData` context
- [ ] Handle concept stats reading/updating
- [ ] Add notification state management

### Phase 3: UI Components
- [ ] Create `DifficultyBanner` component
- [ ] Implement three visual variants (level up, level down, achievement)
- [ ] Add slide-in/fade-out animations
- [ ] Add auto-dismiss timer (4s)
- [ ] Add internationalization (i18n) for messages

### Phase 4: Integration
- [ ] Integrate hook into `PracticePage.tsx`
- [ ] Pass `currentDifficulty` to task API request
- [ ] Call `checkAndAdjustDifficulty()` after task completion
- [ ] Render `DifficultyBanner` when notification present
- [ ] Add integration tests

### Phase 5: Polish
- [ ] Add accessibility (ARIA labels, keyboard dismiss)
- [ ] Test across browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile devices
- [ ] Verify sync behavior with multiple tabs
- [ ] Update user documentation

## Success Metrics

**Technical:**
- Zero data loss during migration
- < 50ms overhead for streak calculation
- 100% test coverage for adjustment logic

**User Experience:**
- Banner animation feels smooth (60fps)
- Messages are encouraging and age-appropriate
- Difficulty adjustments feel fair and motivating

## Future Enhancements (Out of Scope)

- Historical difficulty tracking (chart of difficulty over time)
- Customizable thresholds per age group
- AI-powered difficulty suggestions based on patterns
- Parent/teacher dashboard showing difficulty progression
- Difficulty badges or achievements
- Option to manually override difficulty
