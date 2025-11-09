# Logikids Data Tracking - Quick Reference

## Data Structure Overview

```
UserData (Encrypted in localStorage)
├── userId: string (UUID)
├── settings: UserSettings
│   ├── name, age, grade, language, gender
│   └── syncEnabled: boolean
├── progress: Record<subject, DifficultyStats>
│   └── Example: progress['math']['easy'] = { correct: 5, wrong: 1, hintsUsed: 2 }
├── gameStats: GameStats
│   ├── streaks: { currentDays, bestDays, lastActiveDate }
│   ├── perfectRun: { current, allTimeBest }
│   ├── weekly: { noHintTasks, weekStart }
│   ├── personalBests: { successRate }
│   ├── subjectMastery: { [subject]: { stars: 0-5, lastCalculated } }
│   └── achievements: { [id]: { unlocked, date? } }
├── lastTask: { subject, concept? }
├── timestamp: number
└── lastSyncTimestamp?: number
```

## What Gets Recorded When User Completes a Task

```typescript
updateStats({
  subject: 'math',           // Subject name
  difficulty: 'medium',      // easy | medium | hard
  correct: true,             // boolean
  hintsUsed: 1               // number (0 = no hints)
})
```

Updates flow:
1. `progress['math']['medium']` → { correct++, hintsUsed += 1 }
2. `gameStats.streaks` → Check if streak continues
3. `gameStats.perfectRun` → Reset or increment
4. `gameStats.weekly.noHintTasks` → Increment if hintsUsed === 0
5. `gameStats.subjectMastery['math']` → Recalculate stars

## Key Metrics & How They're Calculated

| Metric | Calculation | Where Used |
|--------|-----------|-----------|
| **Success Rate** | correct / (correct + wrong) * 100 | StatsPage, PerformanceStats |
| **Subject Mastery** | Stars based on task count + success rate | SubjectSkillBars, practice mode |
| **Overall Level** | Based on total correct answers vs TASK_LEVELS | LevelBadge, welcome page |
| **Current Streak** | Days since last correct answer | StatsPage, achievements |
| **Perfect Run** | Consecutive correct answers | Achievements, metrics |
| **Weekly No-Hint** | Tasks without hints in current week | Achievements |
| **Personal Best** | Highest overall success rate ever | StatsPage |

## Subject Mastery Thresholds

```
0 stars: No tasks attempted
1 star:  ≥1 task
2 stars: ≥10 tasks AND ≥40% success rate
3 stars: ≥25 tasks AND ≥60% success rate
4 stars: ≥50 tasks AND ≥75% success rate
5 stars: ≥100 tasks AND ≥90% success rate
```

## Critical Limitation for Practice Mode

**Current data tracks performance at SUBJECT level only**

❌ Cannot identify which specific CONCEPTS are weak
❌ Cannot filter practice to specific weak concepts
❌ No timestamp tracking
❌ No per-task history

**Example Gap**:
- Math subject has 3 stars overall
- But we don't know if weak area is "fractions" vs "algebra"
- Can only offer "practice all math" mode

## Data Access Patterns

### In React Components
```typescript
import { useUserData } from '@/app/account'
import { useProgress } from '@/app/stats'

function MyComponent() {
  const { data } = useUserData()                    // UserData
  const { progress, gameStats } = useProgress()    // Derived data
  
  // Access examples:
  const mathStats = progress['math']['easy']
  const mathMastery = gameStats.subjectMastery['math'].stars
  const level = computeLevel(getTotalCorrectTasks(progress))
}
```

### Direct File Access
```typescript
import { getData, updateProgress, updateGameStats } from '@/data'

const userData = await getData()
await updateProgress(newStats)
await updateGameStats(newGameStats)
```

## File Locations

**Frontend Stats**:
- `packages/frontend/src/app/stats/useProgress.ts` ← Central hook
- `packages/frontend/src/app/stats/types.ts` ← Progress structure
- `packages/frontend/src/app/stats/gameTypes.ts` ← GameStats structure

**Frontend Data Storage**:
- `packages/frontend/src/data/core/userData.ts` ← Read/write operations
- `packages/frontend/src/data/core/types.ts` ← UserData structure

**Task Recording**:
- `packages/frontend/src/app/tasks/TaskPage.tsx` ← Calls updateStats()

**Display Components**:
- `packages/frontend/src/app/stats/StatsPage.tsx` ← Full stats dashboard
- `packages/frontend/src/app/stats/PerformanceStats.tsx` ← Success rate + hints
- `packages/frontend/src/app/stats/SubjectSkillBars.tsx` ← Subject mastery bars

## Data Persistence

```
User Answer → updateStats() → useProgress hook
    ↓
State updated (progress + gameStats)
    ↓
updateProgress() + updateGameStats() called
    ↓
encrypt(UserData) → localStorage['logikids_data']
    ↓
(Optional) Sync to backend via PUT /api/sync/:userId
```

## For Practice Mode Feature

**Minimum Viable**: Use existing data
```typescript
// Identify weak subjects
const weakSubjects = Object.entries(gameStats.subjectMastery)
  .filter(([_, m]) => m.stars <= 2)
  .map(([subject, _]) => subject)
```

**Recommended**: Add concept-level tracking
- Modify progress structure to include concept dimension
- Record concept ID with each task completion
- Calculate per-concept mastery stars

**Data structure change needed**:
```typescript
// OLD: progress[subject][difficulty]
// NEW: progress[subject][concept][difficulty]
```

## Summary

| Aspect | Status | Notes |
|--------|--------|-------|
| Subject performance | ✓ Complete | Stars, success rate, task counts |
| Difficulty breakdown | ✓ Complete | Separate stats per easy/medium/hard |
| Gamification | ✓ Complete | Streaks, achievements, levels |
| Concept performance | ✗ Missing | CRITICAL for practice mode |
| Task history | ✗ Missing | No timestamps or individual task records |
| Time tracking | ✗ Missing | No duration or time-of-day data |
| Answer patterns | ✗ Missing | No detail on wrong answers |

