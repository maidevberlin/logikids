# Logikids User Progress & Performance Data Tracking - Comprehensive Analysis

## Executive Summary

The Logikids application **tracks user progress and performance across three main dimensions**:
1. **Task Statistics** (correct/incorrect answers by subject and difficulty)
2. **Gamification Metrics** (streaks, achievements, personal bests)
3. **Subject Mastery** (0-5 star ratings per subject)

However, **concept-level tracking is currently NOT implemented**. Performance data is aggregated at the subject level only, meaning we cannot identify which specific concepts within a subject are weak areas.

---

## 1. Data Storage Architecture

### Frontend Storage (Client-Side Encrypted)
All user data is stored client-side with zero-knowledge encryption:

**Location**: `localStorage` (key: `logikids_data`)

**Encryption**:
- Algorithm: AES-256-GCM
- Key: Stored in IndexedDB (separate from encrypted blob)
- Mechanism: Client-side encryption means the server never has access to plaintext data

**User Data Structure** (`UserData`):
```typescript
interface UserData {
  userId: string                          // UUID
  settings: UserSettings
  progress: Record<string, any>           // Task statistics
  gameStats?: GameStats                   // Gamification metrics
  lastTask: LastTask                      // Last subject/concept accessed
  timestamp: number                       // Last update time
  lastSyncTimestamp?: number              // When synced to backend
  encryptionKey?: string                  // Only during export/import
}

interface UserSettings {
  name: string
  age: number
  grade: number
  language: string
  gender: string
  syncEnabled: boolean
}

interface LastTask {
  subject: string
  concept?: string                        // Last concept studied
}
```

### Backend Storage (PostgreSQL)

**Tables**:
- `user_accounts`: Tracks user registration via invite codes
- `schema_migrations`: Version control for DB
- No dedicated stats table - server only stores encrypted blobs in sync endpoint

**Sync Mechanism** (`packages/backend/src/sync/`):
- Encrypted blobs are uploaded/downloaded via `PUT/GET /api/sync/:userId`
- Server stores encrypted data with checksum (SHA-256) for integrity
- Maximum 1MB blob size per user
- No server-side analytics or stats computation

---

## 2. Progress Tracking: Task Statistics

### Data Structure

**Per-Subject, Per-Difficulty Statistics**:
```typescript
interface TaskStats {
  correct: number        // Correct answers
  wrong: number          // Incorrect answers
  hintsUsed: number      // Total hints consumed
}

interface DifficultyStats {
  easy: TaskStats
  medium: TaskStats
  hard: TaskStats
}

// Final structure
type ProgressStats = Record<string, DifficultyStats>
// Example: { "math": { "easy": {...}, "medium": {...}, "hard": {...} } }
```

### Metrics Derived from Task Stats

**1. Success Rate** (per subject/difficulty):
```
successRate = (correct / (correct + wrong)) * 100
```

**2. Average Hints Used** (per subject/difficulty):
```
averageHints = total_hintsUsed / (correct + wrong)
```

**3. Total Tasks** (per subject/difficulty or overall):
```
totalTasks = correct + wrong
```

**4. Overall Success Rate** (across all subjects/difficulties):
```
totalCorrect = sum of all correct answers
totalAttempts = sum of all correct + wrong answers
overallSuccessRate = (totalCorrect / totalAttempts) * 100
```

### Where Stats Are Updated

**File**: `packages/frontend/src/app/tasks/TaskPage.tsx`

When a user completes a task:
1. Answer is checked
2. `updateStats()` hook is called with:
   - `subject`: Task subject
   - `difficulty`: Task difficulty (easy/medium/hard)
   - `correct`: Boolean (true = correct, false = incorrect)
   - `hintsUsed`: Number of hints used for this task
3. Stats are persisted to both:
   - Local state (React)
   - `UserData.progress` via `updateProgress()`
   - Encrypted localStorage

---

## 3. Gamification Metrics

### GameStats Structure

```typescript
interface GameStats {
  version: 1
  
  // Daily streaks
  streaks: {
    currentDays: number        // Consecutive days with correct answer
    bestDays: number           // Longest streak ever
    lastActiveDate: string     // ISO date (UTC)
  }
  
  // Perfect run tracking (consecutive correct answers)
  perfectRun: {
    current: number            // Current streak of correct answers
    allTimeBest: number        // Best consecutive correct answers ever
  }
  
  // Weekly metrics (resets every Monday)
  weekly: {
    noHintTasks: number        // Tasks completed without hints this week
    weekStart: string          // ISO date of week start (Monday)
  }
  
  // Overall performance
  personalBests: {
    successRate: number        // Highest success rate achieved
  }
  
  // Subject mastery
  subjectMastery: {
    [subject: string]: {
      stars: number            // 0-5 stars
      lastCalculated: string   // ISO timestamp
    }
  }
  
  // Achievements system
  achievements: {
    [achievementId: string]: {
      unlocked: boolean
      date?: string            // ISO timestamp when unlocked
    }
  }
}
```

### Key Calculations

**Subject Mastery** (0-5 stars):
```typescript
function calculateSubjectMastery(subject: string, stats: ProgressStats): number {
  // Aggregate across ALL difficulties for this subject
  const totalTasks = sum of (correct + wrong) for all difficulties
  const totalCorrect = sum of correct for all difficulties
  const successRate = (totalCorrect / totalTasks) * 100
  
  // Thresholds:
  if (totalTasks >= 100 && successRate >= 90) return 5  // Master
  if (totalTasks >= 50 && successRate >= 75) return 4   // Advanced
  if (totalTasks >= 25 && successRate >= 60) return 3   // Intermediate
  if (totalTasks >= 10 && successRate >= 40) return 2   // Novice
  if (totalTasks > 0) return 1                           // Beginner
  return 0                                                // No tasks
}
```

**Level System** (based on total correct tasks):
```typescript
const TASK_LEVELS = [
  5, 15, 30, 50,           // Levels 1-4 (blue)
  75, 100, 150, 200,       // Levels 5-8 (indigo)
  300, 400, 550, 700,      // Levels 9-12 (purple)
  900, 1100, 1350, 1600,   // Levels 13-16 (violet)
  2000, 2500, 3000, 4000   // Levels 17-20 (fuchsia)
]
// Level increments based on cumulative correct task count
```

### Achievements System

**File**: `packages/frontend/src/app/stats/achievements.ts`

8 total achievements across 4 tiers:

**Tier 1 (Beginner)**:
- `firstSteps`: 5 correct tasks
- `dedicated`: 3-day streak

**Tier 2 (Intermediate)**:
- `weekWarrior`: 7-day streak
- `sharpshooter`: 10 consecutive correct answers

**Tier 3 (Advanced)**:
- `speedDemon`: 5 no-hint tasks this week
- `polymath`: 3+ stars in 3+ different subjects

**Tier 4 (Expert)**:
- `scholar`: 100 correct tasks (Level 10)
- `master`: 5 stars in any subject

---

## 4. What Data IS Currently Tracked

| Metric | Granularity | Storage | Notes |
|--------|-------------|---------|-------|
| **Correct/Wrong Count** | Subject + Difficulty | UserData.progress | Per-difficulty breakdown |
| **Hints Used** | Subject + Difficulty | UserData.progress | Total count only, no detail |
| **Success Rate** | Subject + Difficulty | Calculated on-demand | Not stored, derived |
| **Subject Mastery** | Subject only | GameStats.subjectMastery | 0-5 stars per subject |
| **Streaks** | Overall | GameStats.streaks | Consecutive days with correct answer |
| **Perfect Run** | Overall | GameStats.perfectRun | Consecutive correct answers |
| **Weekly No-Hint Tasks** | Weekly | GameStats.weekly | Resets every Monday |
| **Personal Best** | Overall | GameStats.personalBests | Highest success rate |
| **Achievements** | Individual achievements | GameStats.achievements | Unlock date tracked |
| **Level** | Overall | Derived from total correct | Calculated from TASK_LEVELS thresholds |
| **Last Task** | Subject + optional concept | UserData.lastTask | For "Continue Learning" feature |

---

## 5. What Data IS NOT Currently Tracked

### Critical Gaps for Practice Mode Feature

| Gap | Impact | Severity |
|-----|--------|----------|
| **Concept-level performance** | Cannot identify weak concepts within subjects | HIGH |
| **Time spent per task** | No learning pace metrics | MEDIUM |
| **Task attempt history** | No ability to replay specific failed tasks | HIGH |
| **Answer detail storage** | No pattern analysis of wrong answers | MEDIUM |
| **Difficulty progression** | No tracking of optimal difficulty per user | MEDIUM |
| **Time of day performance** | No ability to recommend study times | LOW |
| **Hint usage patterns** | Only total count, no per-task hint patterns | MEDIUM |
| **Inter-task performance trends** | No time-series analytics | MEDIUM |

### Why These Gaps Exist

1. **Zero-Knowledge Architecture**: Server cannot compute analytics on plaintext data
2. **Client-Side Only Storage**: No server-side database for per-task records
3. **Privacy-First Design**: By design, no detailed activity logging to the server
4. **Current Focus**: System optimizes for gamification (streaks, achievements) not detailed analytics

---

## 6. APIs & Endpoints

### Frontend Data Management

**File**: `packages/frontend/src/data/core/userData.ts`

```typescript
// Read/Write user data
async initialize(): Promise<UserData | null>
async registerUser(inviteCode: string): Promise<UserData>
async getData(): Promise<UserData | null>
async setData(updates: Partial<UserData>): Promise<void>

// Convenience updates
async updateSettings(settings: Partial<UserSettings>): Promise<void>
async updateProgress(progress: Record<string, any>): Promise<void>
async updateGameStats(gameStats: GameStats): Promise<void>
```

### Progress Hook

**File**: `packages/frontend/src/app/stats/useProgress.ts`

Centralized hook providing:
```typescript
const {
  progress,                    // Current UserProgress
  gameStats,                   // Current GameStats
  updateStats(update),         // Update stats for task completion
  getSuccessRate(subject, difficulty),
  getAverageHints(subject, difficulty),
  getTotalTasks(subject, difficulty),
  getTotalTasksOverall(),
  getOverallSuccessRate(),
  getOverallAverageHints(),
  totalCorrectTasks,           // Computed
  levelInfo,                   // Computed
  getLevelColor(level),        // UI helper
  unlockedAchievements         // Computed
} = useProgress()
```

### Backend Sync Endpoint

**File**: `packages/backend/src/sync/`

```
PUT /api/sync/:userId        - Upload encrypted blob
GET /api/sync/:userId        - Download encrypted blob
POST /api/sync/:userId/verify - Check user exists
DELETE /api/sync/:userId     - Delete all user data (GDPR)
```

**No analytics or stats endpoints on backend** - all computation happens client-side

---

## 7. Accessing the Data

### In React Components

```typescript
// Get user data and stats
const { data } = useUserData()
const { progress, gameStats } = useProgress()

// data.progress structure:
// {
//   "math": {
//     "easy": { correct: 5, wrong: 1, hintsUsed: 2 },
//     "medium": { correct: 8, wrong: 3, hintsUsed: 5 },
//     "hard": { correct: 2, wrong: 4, hintsUsed: 8 }
//   },
//   "logic": { ... }
// }

// gameStats structure:
// {
//   version: 1,
//   streaks: { currentDays: 7, bestDays: 14, lastActiveDate: "2025-11-07" },
//   perfectRun: { current: 3, allTimeBest: 15 },
//   weekly: { noHintTasks: 5, weekStart: "2025-11-03" },
//   personalBests: { successRate: 92.3 },
//   subjectMastery: {
//     "math": { stars: 4, lastCalculated: "2025-11-07T..." },
//     "logic": { stars: 3, lastCalculated: "2025-11-06T..." }
//   },
//   achievements: {
//     "weekWarrior": { unlocked: true, date: "2025-11-05T..." },
//     "speedDemon": { unlocked: true, date: "2025-11-07T..." }
//   }
// }
```

### Direct Access (Async)
```typescript
import { getData, updateProgress, updateGameStats } from '@/data'

const userData = await getData()
const subjectStats = userData.progress['math']
const masteryLevel = userData.gameStats.subjectMastery['math'].stars

await updateProgress({ 'physics.easy': { correct: 10, wrong: 2, hintsUsed: 5 } })
await updateGameStats(newGameStats)
```

---

## 8. Is This Data Sufficient for a Practice Mode Feature?

### For Basic Practice Mode (Practice Weak Subjects): **YES, PARTIALLY**

Can do:
- Identify weak subjects (lowest mastery stars)
- Filter tasks by difficult subjects
- Show improvement over time

Example:
```typescript
const weakSubjects = Object.entries(gameStats.subjectMastery)
  .sort((a, b) => a[1].stars - b[1].stars)
  .slice(0, 2)
  .map(([subject, _]) => subject)
// Returns: ['german', 'logic'] if they have lowest stars
```

### For Advanced Practice Mode (Practice Weak Concepts): **NO, NOT CURRENTLY**

Missing:
- Concept identifier in stats structure
- Concept-level correct/wrong counts
- Per-concept success rates

What's needed:
```typescript
// Current (DOESN'T EXIST):
const conceptStats = {
  "math.algebra": { correct: 3, wrong: 2 },
  "math.fractions": { correct: 8, wrong: 1 }
}

// Would need to modify stats structure from:
type ProgressStats = Record<string, DifficultyStats>  // [subject][difficulty]
// To:
type ProgressStats = Record<string, Record<string, DifficultyStats>>  // [subject][concept][difficulty]
```

### For Detailed Analytics: **NO**

Missing:
- Timestamp of task attempts
- Individual task responses
- Time spent per task
- Which specific concepts in a subject are weak

---

## 9. Recommendations for Practice Mode Feature

### Minimum Enhancement (Low Effort)

If you want practice-by-weak-subject only:
- **Current data is sufficient** ✓
- Implementation: Use `gameStats.subjectMastery` to identify weakest subjects
- Use `progress[subject]` to filter concept selection

Example code:
```typescript
// Get weakest subjects
const weakSubjects = Object.entries(gameStats.subjectMastery)
  .filter(([_, mastery]) => mastery.stars <= 3)
  .map(([subject, _]) => subject)

// Allow practice mode for these subjects
<PracticeMode subjectsFilter={weakSubjects} />
```

### Recommended Enhancement (Medium Effort)

To track concept-level performance:

**1. Modify Progress Structure** (Migration needed):
```typescript
// Old: Record<subject, Record<difficulty, stats>>
// New: Record<subject, Record<concept?, Record<difficulty, stats>>>

interface ConceptStats {
  [difficulty: string]: TaskStats
}

interface SubjectStats {
  // Subject-level aggregates
  __all__?: Record<string, TaskStats>  // Aggregated across concepts
  // Concept-level breakdown
  [conceptId: string]: ConceptStats
}

type ProgressStats = Record<string, SubjectStats>
```

**2. Update Task Recording**:
```typescript
// When task is completed, include concept ID
updateStats({
  subject: 'math',
  concept: 'fractions',      // NEW
  difficulty: 'medium',
  correct: true,
  hintsUsed: 1
})
```

**3. Add Concept Mastery Calculation**:
```typescript
function calculateConceptMastery(
  subject: string,
  concept: string,
  stats: ProgressStats
): number {
  // Similar to subject mastery, but for specific concept
}
```

**4. Add Backend Analytics** (Optional):
- Compute on-demand client-side or
- Send anonymized aggregates to backend for dashboards

### Full Enhancement (High Effort)

Add comprehensive task history:
- Store per-task attempts with timestamps
- Track exact wrong answers for pattern analysis
- Enable time-series performance visualization
- Add spaced repetition tracking

---

## 10. Data Flow Diagram

```
┌─────────────────┐
│   TaskPage      │ (User answers question)
└────────┬────────┘
         │
         v
┌─────────────────────────────┐
│  updateStats() called with: │
│  - subject                  │
│  - difficulty               │
│  - correct (T/F)            │
│  - hintsUsed                │
└────────┬────────────────────┘
         │
         v
┌────────────────────────────────────┐
│  useProgress hook                  │
│  - Updates local state (progress)  │
│  - Updates gameStats (streaks, etc)│
│  - Checks achievements             │
│  - Calculates mastery              │
└────────┬─────────────────────────────┘
         │
         v
┌─────────────────────────────────────┐
│  Persist to UserData                │
│  - updateProgress()                 │
│  - updateGameStats()                │
└────────┬──────────────────────────────┘
         │
         v
┌─────────────────────────────────────┐
│  Encrypted localStorage             │
│  - AES-256-GCM encrypted            │
│  - IndexedDB key storage            │
└─────────────────────────────────────┘
```

---

## 11. Summary: What's Tracked vs. What's Missing

### Currently Tracked ✓
- Correct/wrong counts by subject and difficulty
- Hints used (total per subject/difficulty)
- Success rates (calculated from correct/wrong)
- Daily streaks and perfect runs
- Subject mastery (0-5 stars)
- Overall level (based on total correct tasks)
- Achievements and unlock dates
- Weekly no-hint challenge progress

### Not Tracked ✗
- **Concept-level performance** (CRITICAL for practice mode)
- Individual task attempt history
- Timestamps of task completions
- Time spent per task
- Patterns in wrong answers
- Difficulty progression patterns
- Hint usage per task

---

## File References

| File | Purpose |
|------|---------|
| `packages/frontend/src/data/core/types.ts` | UserData structure definitions |
| `packages/frontend/src/data/core/userData.ts` | Data read/write operations |
| `packages/frontend/src/app/stats/types.ts` | Progress and stats types |
| `packages/frontend/src/app/stats/gameTypes.ts` | GameStats structure |
| `packages/frontend/src/app/stats/gameStatsService.ts` | Streaks/mastery calculations |
| `packages/frontend/src/app/stats/progressService.ts` | Progress helper functions |
| `packages/frontend/src/app/stats/useProgress.ts` | Central React hook for all stats |
| `packages/frontend/src/app/stats/achievements.ts` | Achievement definitions and logic |
| `packages/frontend/src/app/tasks/TaskPage.tsx` | Task completion and stat recording |
| `packages/backend/src/sync/sync.controller.ts` | Server sync endpoint |
| `packages/backend/database/migrations/003_user_accounts.sql` | User account schema |

