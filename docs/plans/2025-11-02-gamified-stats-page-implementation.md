# Gamified Stats Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform stats page into a game-like character profile with competitive elements (streaks, achievements, skill bars) to engage teenagers.

**Architecture:** Extend UserData with gameStats, create service layer for calculations, build new hero-focused UI components using shadcn/ui.

**Tech Stack:** React 18, TypeScript, Tailwind CSS v4, shadcn/ui, Zod validation

---

## Task 1: Extend Data Types and Schema

**Files:**
- Modify: `packages/frontend/src/data/core/types.ts:15-22`
- Create: `packages/frontend/src/app/stats/gameTypes.ts`

**Step 1: Create game stats types**

Create `packages/frontend/src/app/stats/gameTypes.ts`:

```typescript
export interface GameStats {
  version: 1

  streaks: {
    currentDays: number
    bestDays: number
    lastActiveDate: string  // ISO date string (UTC)
  }

  perfectRun: {
    current: number
    allTimeBest: number
  }

  weekly: {
    noHintTasks: number
    weekStart: string  // ISO date of Monday
  }

  personalBests: {
    successRate: number
  }

  achievements: {
    [achievementId: string]: {
      unlocked: boolean
      date?: string  // ISO timestamp
    }
  }

  subjectMastery: {
    [subject: string]: {
      stars: number  // 0-5
      lastCalculated: string  // ISO timestamp
    }
  }
}

export function createDefaultGameStats(): GameStats {
  return {
    version: 1,
    streaks: {
      currentDays: 0,
      bestDays: 0,
      lastActiveDate: ''
    },
    perfectRun: {
      current: 0,
      allTimeBest: 0
    },
    weekly: {
      noHintTasks: 0,
      weekStart: getMonday(new Date()).toISOString().split('T')[0]
    },
    personalBests: {
      successRate: 0
    },
    achievements: {},
    subjectMastery: {}
  }
}

function getMonday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(d.setDate(diff))
}
```

**Step 2: Add gameStats to UserData**

Modify `packages/frontend/src/data/core/types.ts`:

```typescript
import { GameStats } from '@/app/stats/gameTypes'

export interface UserData {
  userId: string
  settings: UserSettings
  progress: Record<string, any>
  gameStats?: GameStats  // Optional for backward compatibility
  lastTask: LastTask
  timestamp: number
  lastSyncTimestamp?: number
}
```

**Step 3: Commit**

```bash
git add packages/frontend/src/app/stats/gameTypes.ts packages/frontend/src/data/core/types.ts
git commit -m "feat(stats): add game stats data types"
```

---

## Task 2: Game Stats Service Layer

**Files:**
- Create: `packages/frontend/src/app/stats/gameStatsService.ts`

**Step 1: Create service with mastery calculation**

Create `packages/frontend/src/app/stats/gameStatsService.ts`:

```typescript
import { GameStats } from './gameTypes'
import { ProgressStats } from './types'

/**
 * Calculate subject mastery (0-5 stars) based on tasks and success rate
 */
export function calculateSubjectMastery(
  subject: string,
  stats: ProgressStats
): number {
  const subjectStats = stats[subject]
  if (!subjectStats) return 0

  // Aggregate across all difficulties
  let totalTasks = 0
  let totalCorrect = 0

  Object.values(subjectStats).forEach((diffStats) => {
    totalTasks += diffStats.correct + diffStats.wrong
    totalCorrect += diffStats.correct
  })

  if (totalTasks === 0) return 0

  const successRate = (totalCorrect / totalTasks) * 100

  // Mastery thresholds
  if (totalTasks >= 100 && successRate >= 90) return 5
  if (totalTasks >= 50 && successRate >= 75) return 4
  if (totalTasks >= 25 && successRate >= 60) return 3
  if (totalTasks >= 10 && successRate >= 40) return 2
  if (totalTasks < 10 || successRate < 40) return 1

  return 0
}

/**
 * Update streaks based on task completion
 */
export function updateStreaks(
  gameStats: GameStats,
  taskDate: Date,
  wasCorrect: boolean
): GameStats {
  if (!wasCorrect) return gameStats

  const today = taskDate.toISOString().split('T')[0]
  const lastDate = gameStats.streaks.lastActiveDate

  if (!lastDate) {
    // First task ever
    return {
      ...gameStats,
      streaks: {
        currentDays: 1,
        bestDays: Math.max(1, gameStats.streaks.bestDays),
        lastActiveDate: today
      }
    }
  }

  if (lastDate === today) {
    // Already counted today
    return gameStats
  }

  const yesterday = new Date(taskDate)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  if (lastDate === yesterdayStr) {
    // Continuing streak
    const newCurrent = gameStats.streaks.currentDays + 1
    return {
      ...gameStats,
      streaks: {
        currentDays: newCurrent,
        bestDays: Math.max(newCurrent, gameStats.streaks.bestDays),
        lastActiveDate: today
      }
    }
  }

  // Streak broken, start new
  return {
    ...gameStats,
    streaks: {
      currentDays: 1,
      bestDays: gameStats.streaks.bestDays,
      lastActiveDate: today
    }
  }
}

/**
 * Update perfect run tracking
 */
export function updatePerfectRun(
  gameStats: GameStats,
  wasCorrect: boolean
): GameStats {
  if (wasCorrect) {
    const newCurrent = gameStats.perfectRun.current + 1
    return {
      ...gameStats,
      perfectRun: {
        current: newCurrent,
        allTimeBest: Math.max(newCurrent, gameStats.perfectRun.allTimeBest)
      }
    }
  }

  // Wrong answer breaks the streak
  return {
    ...gameStats,
    perfectRun: {
      current: 0,
      allTimeBest: gameStats.perfectRun.allTimeBest
    }
  }
}

/**
 * Update weekly no-hint counter
 */
export function updateWeeklyNoHint(
  gameStats: GameStats,
  hintsUsed: number
): GameStats {
  const today = new Date()
  const currentMonday = getMonday(today).toISOString().split('T')[0]

  // Check if we need to reset for new week
  if (gameStats.weekly.weekStart !== currentMonday) {
    return {
      ...gameStats,
      weekly: {
        noHintTasks: hintsUsed === 0 ? 1 : 0,
        weekStart: currentMonday
      }
    }
  }

  // Same week, increment if no hints used
  if (hintsUsed === 0) {
    return {
      ...gameStats,
      weekly: {
        ...gameStats.weekly,
        noHintTasks: gameStats.weekly.noHintTasks + 1
      }
    }
  }

  return gameStats
}

/**
 * Check if personal best was broken
 */
export function checkPersonalBest(
  gameStats: GameStats,
  newSuccessRate: number
): boolean {
  return newSuccessRate > gameStats.personalBests.successRate
}

/**
 * Update personal best
 */
export function updatePersonalBest(
  gameStats: GameStats,
  newSuccessRate: number
): GameStats {
  return {
    ...gameStats,
    personalBests: {
      successRate: Math.max(newSuccessRate, gameStats.personalBests.successRate)
    }
  }
}

function getMonday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(d.setDate(diff))
}
```

**Step 2: Commit**

```bash
git add packages/frontend/src/app/stats/gameStatsService.ts
git commit -m "feat(stats): add game stats service layer"
```

---

## Task 3: Achievements System

**Files:**
- Create: `packages/frontend/src/app/stats/achievements.ts`

**Step 1: Define achievements**

Create `packages/frontend/src/app/stats/achievements.ts`:

```typescript
import { GameStats } from './gameTypes'
import { UserProgress } from './types'

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  tier: 1 | 2 | 3 | 4
  checkUnlocked: (gameStats: GameStats, progress: UserProgress) => boolean
  getProgress: (gameStats: GameStats, progress: UserProgress) => { current: number; total: number }
}

export const ACHIEVEMENTS: Achievement[] = [
  // Tier 1 - Beginner
  {
    id: 'firstSteps',
    name: 'First Steps',
    description: 'Complete 5 tasks',
    icon: '🌟',
    tier: 1,
    checkUnlocked: (_, progress) => {
      const total = Object.values(progress.stats).reduce((sum, subject) => {
        return sum + Object.values(subject).reduce((s, stats) => {
          return s + stats.correct + stats.wrong
        }, 0)
      }, 0)
      return total >= 5
    },
    getProgress: (_, progress) => {
      const total = Object.values(progress.stats).reduce((sum, subject) => {
        return sum + Object.values(subject).reduce((s, stats) => {
          return s + stats.correct + stats.wrong
        }, 0)
      }, 0)
      return { current: Math.min(total, 5), total: 5 }
    }
  },
  {
    id: 'dedicated',
    name: 'Dedicated',
    description: 'Maintain a 3-day streak',
    icon: '💪',
    tier: 1,
    checkUnlocked: (gameStats) => gameStats.streaks.currentDays >= 3,
    getProgress: (gameStats) => ({
      current: Math.min(gameStats.streaks.currentDays, 3),
      total: 3
    })
  },

  // Tier 2 - Intermediate
  {
    id: 'weekWarrior',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    tier: 2,
    checkUnlocked: (gameStats) => gameStats.streaks.currentDays >= 7,
    getProgress: (gameStats) => ({
      current: Math.min(gameStats.streaks.currentDays, 7),
      total: 7
    })
  },
  {
    id: 'sharpshooter',
    name: 'Sharpshooter',
    description: 'Complete 10 tasks with 100% accuracy',
    icon: '🎯',
    tier: 2,
    checkUnlocked: (gameStats) => gameStats.perfectRun.allTimeBest >= 10,
    getProgress: (gameStats) => ({
      current: Math.min(gameStats.perfectRun.allTimeBest, 10),
      total: 10
    })
  },

  // Tier 3 - Advanced
  {
    id: 'speedDemon',
    name: 'Speed Demon',
    description: '5 consecutive tasks without hints',
    icon: '⚡',
    tier: 3,
    checkUnlocked: (gameStats) => gameStats.weekly.noHintTasks >= 5,
    getProgress: (gameStats) => ({
      current: Math.min(gameStats.weekly.noHintTasks, 5),
      total: 5
    })
  },
  {
    id: 'polymath',
    name: 'Polymath',
    description: 'Get 3+ stars in all subjects',
    icon: '🌍',
    tier: 3,
    checkUnlocked: (gameStats) => {
      const subjects = Object.keys(gameStats.subjectMastery)
      if (subjects.length < 5) return false  // Assuming 5 subjects minimum
      return subjects.every(s => (gameStats.subjectMastery[s]?.stars ?? 0) >= 3)
    },
    getProgress: (gameStats) => {
      const subjects = Object.keys(gameStats.subjectMastery)
      const with3Plus = subjects.filter(s => (gameStats.subjectMastery[s]?.stars ?? 0) >= 3).length
      return { current: with3Plus, total: 5 }
    }
  },

  // Tier 4 - Expert
  {
    id: 'scholar',
    name: 'Scholar',
    description: 'Reach level 10',
    icon: '🎓',
    tier: 4,
    checkUnlocked: (_, progress) => {
      const totalTasks = Object.values(progress.stats).reduce((sum, subject) => {
        return sum + Object.values(subject).reduce((s, stats) => {
          return s + stats.correct + stats.wrong
        }, 0)
      }, 0)
      // Level 10 is at threshold 100 (from TASK_LEVELS)
      return totalTasks >= 100
    },
    getProgress: (_, progress) => {
      const totalTasks = Object.values(progress.stats).reduce((sum, subject) => {
        return sum + Object.values(subject).reduce((s, stats) => {
          return s + stats.correct + stats.wrong
        }, 0)
      }, 0)
      return { current: Math.min(totalTasks, 100), total: 100 }
    }
  },
  {
    id: 'master',
    name: 'Master',
    description: 'Max out (5 stars) in any subject',
    icon: '👑',
    tier: 4,
    checkUnlocked: (gameStats) => {
      return Object.values(gameStats.subjectMastery).some(m => m.stars === 5)
    },
    getProgress: (gameStats) => {
      const maxStars = Math.max(...Object.values(gameStats.subjectMastery).map(m => m.stars), 0)
      return { current: maxStars, total: 5 }
    }
  }
]

/**
 * Check all achievements and return newly unlocked ones
 */
export function checkAchievements(
  gameStats: GameStats,
  progress: UserProgress
): string[] {
  const newlyUnlocked: string[] = []

  for (const achievement of ACHIEVEMENTS) {
    const wasUnlocked = gameStats.achievements[achievement.id]?.unlocked
    const isNowUnlocked = achievement.checkUnlocked(gameStats, progress)

    if (!wasUnlocked && isNowUnlocked) {
      newlyUnlocked.push(achievement.id)
    }
  }

  return newlyUnlocked
}

/**
 * Mark achievements as unlocked
 */
export function unlockAchievements(
  gameStats: GameStats,
  achievementIds: string[]
): GameStats {
  const now = new Date().toISOString()
  const updatedAchievements = { ...gameStats.achievements }

  for (const id of achievementIds) {
    updatedAchievements[id] = {
      unlocked: true,
      date: now
    }
  }

  return {
    ...gameStats,
    achievements: updatedAchievements
  }
}
```

**Step 2: Commit**

```bash
git add packages/frontend/src/app/stats/achievements.ts
git commit -m "feat(stats): add achievements system"
```

---

## Task 4: Update useProgress Hook

**Files:**
- Modify: `packages/frontend/src/app/stats/useProgress.ts:1-104`

**Step 1: Add game stats initialization and update**

Modify `packages/frontend/src/app/stats/useProgress.ts`:

```typescript
import { useCallback, useEffect, useState } from 'react'
import { UserProgress, StatUpdate } from './types'
import { GameStats, createDefaultGameStats } from './gameTypes'
import * as progressService from './progressService'
import * as gameStatsService from './gameStatsService'
import * as achievementsService from './achievements'
import { Difficulty } from '@/app/tasks'
import { useUserData } from '@/app/account'

export function useProgress() {
  const { data, updateProgress: updateUserDataProgress } = useUserData()
  const [progress, setProgress] = useState<UserProgress>({
    version: 1,
    stats: data?.progress || {},
    lastUpdated: Date.now()
  })
  const [gameStats, setGameStats] = useState<GameStats>(
    data?.gameStats || createDefaultGameStats()
  )

  // Sync with UserData when it changes
  useEffect(() => {
    if (data?.progress) {
      setProgress({
        version: 1,
        stats: data.progress,
        lastUpdated: Date.now()
      })
    }
    if (data?.gameStats) {
      setGameStats(data.gameStats)
    } else if (data) {
      // Initialize game stats if missing
      const defaultStats = createDefaultGameStats()
      setGameStats(defaultStats)
    }
  }, [data?.progress, data?.gameStats])

  // Update stats for a task
  const updateStats = useCallback(async (update: StatUpdate) => {
    const updated = progressService.updateStats(progress, update)
    setProgress(updated)

    // Update game stats
    const wasCorrect = update.correct ?? false
    const hintsUsed = update.hintsUsed ?? 0
    const taskDate = new Date()

    let newGameStats = gameStats

    // Update streaks
    newGameStats = gameStatsService.updateStreaks(newGameStats, taskDate, wasCorrect)

    // Update perfect run
    newGameStats = gameStatsService.updatePerfectRun(newGameStats, wasCorrect)

    // Update weekly no-hint counter
    newGameStats = gameStatsService.updateWeeklyNoHint(newGameStats, hintsUsed)

    // Update subject mastery
    const mastery = gameStatsService.calculateSubjectMastery(update.subject, updated.stats)
    newGameStats = {
      ...newGameStats,
      subjectMastery: {
        ...newGameStats.subjectMastery,
        [update.subject]: {
          stars: mastery,
          lastCalculated: new Date().toISOString()
        }
      }
    }

    // Check for personal best
    const newSuccessRate = getOverallSuccessRate()
    if (gameStatsService.checkPersonalBest(newGameStats, newSuccessRate)) {
      newGameStats = gameStatsService.updatePersonalBest(newGameStats, newSuccessRate)
    }

    // Check achievements
    const newlyUnlocked = achievementsService.checkAchievements(newGameStats, updated)
    if (newlyUnlocked.length > 0) {
      newGameStats = achievementsService.unlockAchievements(newGameStats, newlyUnlocked)
      // TODO: Trigger celebration animation
    }

    setGameStats(newGameStats)

    // Persist both to UserData
    try {
      await updateUserDataProgress(updated.stats)
      // Also update gameStats in UserData (needs new method or extend updateProgress)
      // For now, we'll need to update the UserData context to support gameStats
    } catch (error) {
      console.error('Failed to save progress:', error)
    }
  }, [progress, gameStats, updateUserDataProgress])

  // Get success rate for a subject/difficulty
  const getSuccessRate = useCallback((subject: string, difficulty: Difficulty): number => {
    return progressService.getSuccessRate(progress, subject, difficulty)
  }, [progress])

  // Get average hints used for a subject/difficulty
  const getAverageHints = useCallback((subject: string, difficulty: Difficulty): number => {
    return progressService.getAverageHints(progress, subject, difficulty)
  }, [progress])

  // Get total tasks completed for a subject/difficulty
  const getTotalTasks = useCallback((subject: string, difficulty: Difficulty): number => {
    const stats = progressService.getStats(progress, subject, difficulty)
    return stats.correct + stats.wrong
  }, [progress])

  // Get total tasks completed across all subjects/difficulties
  const getTotalTasksOverall = useCallback((): number => {
    return Object.values(progress.stats).reduce((total, subjectStats) => {
      return total + Object.values(subjectStats).reduce((subTotal, stats) => {
        return subTotal + stats.correct + stats.wrong
      }, 0)
    }, 0)
  }, [progress])

  // Get overall success rate
  const getOverallSuccessRate = useCallback((): number => {
    let totalCorrect = 0
    let totalAttempts = 0

    Object.values(progress.stats).forEach(subjectStats => {
      Object.values(subjectStats).forEach(stats => {
        totalCorrect += stats.correct
        totalAttempts += stats.correct + stats.wrong
      })
    })

    return totalAttempts === 0 ? 0 : (totalCorrect / totalAttempts) * 100
  }, [progress])

  // Get overall average hints
  const getOverallAverageHints = useCallback((): number => {
    let totalHints = 0
    let totalTasks = 0

    Object.values(progress.stats).forEach(subjectStats => {
      Object.values(subjectStats).forEach(stats => {
        totalHints += stats.hintsUsed
        totalTasks += stats.correct + stats.wrong
      })
    })

    return totalTasks === 0 ? 0 : totalHints / totalTasks
  }, [progress])

  return {
    progress,
    gameStats,
    updateStats,
    getSuccessRate,
    getAverageHints,
    getTotalTasks,
    getTotalTasksOverall,
    getOverallSuccessRate,
    getOverallAverageHints,
  }
}
```

**Step 2: Commit**

```bash
git add packages/frontend/src/app/stats/useProgress.ts
git commit -m "feat(stats): integrate game stats into useProgress hook"
```

---

## Task 5: Update UserData Context to Support GameStats

**Files:**
- Modify: `packages/frontend/src/app/account/UserDataContext.tsx:16,84-87`
- Modify: `packages/frontend/src/data/core/userData.ts`

**Step 1: Add updateGameStats method to context**

Modify `packages/frontend/src/app/account/UserDataContext.tsx`:

```typescript
// Add to interface
export interface UserDataContextValue {
  data: UserData | null
  isLoading: boolean
  error: Error | null

  // Core operations
  createNewUser: () => Promise<void>
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>
  updateProgress: (progress: Record<string, any>) => Promise<void>
  updateGameStats: (gameStats: GameStats) => Promise<void>  // NEW
  refresh: () => Promise<void>

  // Plugin operations
  sync: () => Promise<void>
  exportData: () => Promise<string>
  importData: (json: string) => Promise<void>
  generateQR: () => Promise<qrPlugin.QRPayload>
  importQR: (payload: qrPlugin.QRPayload) => Promise<void>
}

// Add to provider
const updateGameStats = async (gameStats: GameStats) => {
  await coreUpdateGameStats(gameStats)
  await refresh()
}

const value: UserDataContextValue = {
  data,
  isLoading,
  error,
  createNewUser,
  updateSettings,
  updateProgress,
  updateGameStats,  // NEW
  refresh,
  sync,
  exportData,
  importData,
  generateQR,
  importQR
}
```

**Step 2: Add updateGameStats to core userData**

Find and modify `packages/frontend/src/data/core/userData.ts` to add:

```typescript
import { GameStats } from '@/app/stats/gameTypes'

export async function updateGameStats(gameStats: GameStats): Promise<void> {
  const data = await getData()
  if (!data) throw new Error('No user data found')

  data.gameStats = gameStats
  data.timestamp = Date.now()

  await storage.save(data)
  window.dispatchEvent(new Event('data-changed'))
}
```

**Step 3: Update useProgress to use new method**

Modify `packages/frontend/src/app/stats/useProgress.ts` in the `updateStats` callback:

```typescript
// Persist both to UserData
try {
  await updateUserDataProgress(updated.stats)
  await updateGameStats(newGameStats)  // NEW LINE
} catch (error) {
  console.error('Failed to save progress:', error)
}
```

But we need to get `updateGameStats` from context, so add to hook:

```typescript
const { data, updateProgress: updateUserDataProgress, updateGameStats: updateUserGameStats } = useUserData()

// ... later in updateStats
await updateUserGameStats(newGameStats)
```

**Step 4: Commit**

```bash
git add packages/frontend/src/app/account/UserDataContext.tsx packages/frontend/src/data/core/userData.ts packages/frontend/src/app/stats/useProgress.ts
git commit -m "feat(stats): add gameStats update to UserData context"
```

---

## Task 6: Create Level Badge Component

**Files:**
- Create: `packages/frontend/src/app/stats/LevelBadge.tsx`

**Step 1: Create component**

Create `packages/frontend/src/app/stats/LevelBadge.tsx`:

```typescript
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const TASK_LEVELS = [
  { threshold: 5, colorClass: 'bg-blue-300' },
  { threshold: 15, colorClass: 'bg-blue-400' },
  { threshold: 30, colorClass: 'bg-blue-500' },
  { threshold: 50, colorClass: 'bg-blue-600' },
  { threshold: 75, colorClass: 'bg-indigo-300' },
  { threshold: 100, colorClass: 'bg-indigo-400' },
  { threshold: 150, colorClass: 'bg-indigo-500' },
  { threshold: 200, colorClass: 'bg-indigo-600' },
  { threshold: 300, colorClass: 'bg-purple-300' },
  { threshold: 400, colorClass: 'bg-purple-400' },
  { threshold: 550, colorClass: 'bg-purple-500' },
  { threshold: 700, colorClass: 'bg-purple-600' },
  { threshold: 900, colorClass: 'bg-violet-300' },
  { threshold: 1100, colorClass: 'bg-violet-400' },
  { threshold: 1350, colorClass: 'bg-violet-500' },
  { threshold: 1600, colorClass: 'bg-violet-600' },
  { threshold: 2000, colorClass: 'bg-fuchsia-300' },
  { threshold: 2500, colorClass: 'bg-fuchsia-400' },
  { threshold: 3000, colorClass: 'bg-fuchsia-500' },
  { threshold: 4000, colorClass: 'bg-fuchsia-600' },
]

interface LevelBadgeProps {
  totalTasks: number
}

export function LevelBadge({ totalTasks }: LevelBadgeProps) {
  const { t } = useTranslation('stats')

  const currentLevelIndex = TASK_LEVELS.findIndex(level => totalTasks < level.threshold)
  const currentLevel = currentLevelIndex === -1 ? TASK_LEVELS.length : currentLevelIndex
  const previousThreshold = currentLevel > 0 ? TASK_LEVELS[currentLevel - 1].threshold : 0
  const nextThreshold = currentLevel >= TASK_LEVELS.length
    ? TASK_LEVELS[TASK_LEVELS.length - 1].threshold
    : TASK_LEVELS[currentLevel].threshold
  const progress = ((totalTasks - previousThreshold) / (nextThreshold - previousThreshold)) * 100
  const colorClass = TASK_LEVELS[Math.min(currentLevel, TASK_LEVELS.length - 1)].colorClass

  return (
    <Card className="p-8 bg-white shadow-md rounded-2xl flex flex-col items-center space-y-4">
      {/* Circular badge with progress ring */}
      <div className="relative w-40 h-40">
        {/* Progress ring */}
        <svg className="w-40 h-40 transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 70}`}
            strokeDashoffset={`${2 * Math.PI * 70 * (1 - progress / 100)}`}
            className={`transition-all duration-1000 ${colorClass.replace('bg-', 'text-')}`}
            strokeLinecap="round"
          />
        </svg>

        {/* Level number in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              Level
            </div>
            <div className={`text-5xl font-bold ${colorClass.replace('bg-', 'text-')}`}>
              {currentLevel + 1}
            </div>
          </div>
        </div>
      </div>

      {/* XP progress text */}
      <div className="text-center">
        <div className="text-lg font-medium text-gray-700">
          {totalTasks} / {nextThreshold} {t('tasks', { defaultValue: 'tasks' })}
        </div>
      </div>
    </Card>
  )
}
```

**Step 2: Commit**

```bash
git add packages/frontend/src/app/stats/LevelBadge.tsx
git commit -m "feat(stats): add level badge component"
```

---

## Task 7: Create Subject Skill Bars Component

**Files:**
- Create: `packages/frontend/src/app/stats/SubjectSkillBars.tsx`

**Step 1: Create component**

Create `packages/frontend/src/app/stats/SubjectSkillBars.tsx`:

```typescript
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/card'
import { GameStats } from './gameTypes'

const SUBJECT_COLORS: Record<string, string> = {
  math: 'bg-blue-500',
  logic: 'bg-purple-500',
  physics: 'bg-emerald-500',
  german: 'bg-red-500',
  music: 'bg-pink-500',
  english: 'bg-yellow-500'
}

interface SubjectSkillBarsProps {
  gameStats: GameStats
}

export function SubjectSkillBars({ gameStats }: SubjectSkillBarsProps) {
  const { t } = useTranslation('stats')

  // Sort subjects by mastery, then alphabetically
  const subjects = Object.entries(gameStats.subjectMastery)
    .sort(([, a], [, b]) => {
      if (b.stars !== a.stars) return b.stars - a.stars
      return 0
    })
    .slice(0, 5) // Top 5 only

  if (subjects.length === 0) {
    return (
      <Card className="p-8 bg-white shadow-md rounded-2xl">
        <h3 className="text-lg font-medium text-gray-700 mb-4">
          {t('hero.skills', { defaultValue: 'Skills' })}
        </h3>
        <p className="text-gray-500 text-center py-8">
          {t('empty.keepPracticing', { defaultValue: 'Complete tasks to level up your skills!' })}
        </p>
      </Card>
    )
  }

  return (
    <Card className="p-8 bg-white shadow-md rounded-2xl">
      <h3 className="text-lg font-medium text-gray-700 mb-6">
        {t('hero.skills', { defaultValue: 'Skills' })}
      </h3>

      <div className="space-y-4">
        {subjects.map(([subject, mastery]) => {
          const subjectColor = SUBJECT_COLORS[subject] || 'bg-gray-500'

          return (
            <div key={subject} className="flex items-center gap-4">
              <div className="w-20 text-sm font-medium text-gray-700 uppercase">
                {t(`subjects.${subject}.label`, { defaultValue: subject })}
              </div>

              <div className="flex-1 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div
                    key={star}
                    className={`h-4 flex-1 rounded transition-all duration-300 ${
                      star <= mastery.stars
                        ? subjectColor
                        : 'bg-gray-200'
                    }`}
                    style={{
                      transitionDelay: `${star * 100}ms`
                    }}
                  />
                ))}
              </div>

              <div className="w-8 text-sm font-bold text-gray-600">
                {mastery.stars}/5
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
```

**Step 2: Commit**

```bash
git add packages/frontend/src/app/stats/SubjectSkillBars.tsx
git commit -m "feat(stats): add subject skill bars component"
```

---

## Task 8: Create Competitive Metric Cards

**Files:**
- Create: `packages/frontend/src/app/stats/MetricCard.tsx`
- Create: `packages/frontend/src/app/stats/CompetitiveMetrics.tsx`

**Step 1: Create reusable metric card**

Create `packages/frontend/src/app/stats/MetricCard.tsx`:

```typescript
import { Card } from '@/components/ui/card'

interface MetricCardProps {
  icon: string
  title: string
  value: string | number
  subtitle: string
  highlight?: string
  colorClass?: string
}

export function MetricCard({
  icon,
  title,
  value,
  subtitle,
  highlight,
  colorClass = 'text-blue-600'
}: MetricCardProps) {
  return (
    <Card className="p-6 bg-white shadow-sm rounded-2xl border-0 hover:shadow-md transition-shadow duration-200">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl">{icon}</span>
          <h3 className="text-base font-medium text-gray-700">{title}</h3>
        </div>

        <div className={`text-5xl font-bold ${colorClass}`}>
          {value}
        </div>

        <div className="text-sm text-gray-500">{subtitle}</div>

        {highlight && (
          <div className="text-sm font-medium text-gray-600 bg-gray-100 rounded-full px-3 py-1 inline-block">
            {highlight}
          </div>
        )}
      </div>
    </Card>
  )
}
```

**Step 2: Create metrics grid**

Create `packages/frontend/src/app/stats/CompetitiveMetrics.tsx`:

```typescript
import { useTranslation } from 'react-i18next'
import { MetricCard } from './MetricCard'
import { GameStats } from './gameTypes'

interface CompetitiveMetricsProps {
  gameStats: GameStats
  overallSuccessRate: number
}

export function CompetitiveMetrics({
  gameStats,
  overallSuccessRate
}: CompetitiveMetricsProps) {
  const { t } = useTranslation('stats')

  const isPersonalBest = overallSuccessRate > 0 &&
    overallSuccessRate >= gameStats.personalBests.successRate

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Streak */}
      <MetricCard
        icon="🔥"
        title={t('metrics.streak', { defaultValue: 'Streak' })}
        value={gameStats.streaks.currentDays}
        subtitle={t('metrics.days', { defaultValue: 'days' })}
        highlight={t('metrics.bestStreak', {
          days: gameStats.streaks.bestDays,
          defaultValue: `Best: ${gameStats.streaks.bestDays}`
        })}
        colorClass="text-orange-600"
      />

      {/* Perfect Run */}
      <MetricCard
        icon="🏆"
        title={t('metrics.perfectRun', { defaultValue: 'Perfect Run' })}
        value={gameStats.perfectRun.current || gameStats.perfectRun.allTimeBest}
        subtitle={t('metrics.inARow', { defaultValue: 'in a row' })}
        highlight={t('metrics.allTimeBest', {
          count: gameStats.perfectRun.allTimeBest,
          defaultValue: `Record: ${gameStats.perfectRun.allTimeBest}`
        })}
        colorClass="text-yellow-600"
      />

      {/* No-Hint Master */}
      <MetricCard
        icon="⚡"
        title={t('metrics.noHints', { defaultValue: 'No-Hint Master' })}
        value={gameStats.weekly.noHintTasks}
        subtitle={t('metrics.thisWeek', { defaultValue: 'this week' })}
        colorClass="text-purple-600"
      />

      {/* Accuracy */}
      <MetricCard
        icon="🎯"
        title={t('metrics.accuracy', { defaultValue: 'Accuracy' })}
        value={`${overallSuccessRate.toFixed(1)}%`}
        subtitle={t('metrics.success', { defaultValue: 'success' })}
        highlight={isPersonalBest ? t('metrics.personalBest', { defaultValue: 'Personal Best!' }) : undefined}
        colorClass="text-green-600"
      />
    </div>
  )
}
```

**Step 3: Commit**

```bash
git add packages/frontend/src/app/stats/MetricCard.tsx packages/frontend/src/app/stats/CompetitiveMetrics.tsx
git commit -m "feat(stats): add competitive metric cards"
```

---

## Task 9: Create Achievement Components

**Files:**
- Create: `packages/frontend/src/app/stats/AchievementBadge.tsx`
- Create: `packages/frontend/src/app/stats/AchievementsGrid.tsx`

**Step 1: Create achievement badge**

Create `packages/frontend/src/app/stats/AchievementBadge.tsx`:

```typescript
import { Achievement } from './achievements'
import { GameStats } from './gameTypes'
import { UserProgress } from './types'

interface AchievementBadgeProps {
  achievement: Achievement
  gameStats: GameStats
  progress: UserProgress
}

export function AchievementBadge({
  achievement,
  gameStats,
  progress
}: AchievementBadgeProps) {
  const isUnlocked = gameStats.achievements[achievement.id]?.unlocked || false
  const progressData = achievement.getProgress(gameStats, progress)
  const progressPercent = (progressData.current / progressData.total) * 100

  return (
    <div
      className={`
        relative p-6 rounded-2xl border-2 transition-all duration-200
        ${isUnlocked
          ? 'bg-white border-gray-200 shadow-md hover:shadow-lg hover:scale-105'
          : 'bg-gray-50 border-gray-200 opacity-60 hover:opacity-80'
        }
      `}
    >
      {/* Icon */}
      <div className={`text-5xl mb-3 text-center ${isUnlocked ? '' : 'grayscale'}`}>
        {achievement.icon}
      </div>

      {/* Name */}
      <div className={`text-center font-bold mb-1 ${isUnlocked ? 'text-gray-900' : 'text-gray-500'}`}>
        {achievement.name}
      </div>

      {/* Description */}
      <div className={`text-sm text-center mb-3 ${isUnlocked ? 'text-gray-600' : 'text-gray-400'}`}>
        {achievement.description}
      </div>

      {/* Progress bar for locked achievements */}
      {!isUnlocked && (
        <div className="mt-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-400 transition-all duration-300"
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 text-center mt-1">
            {progressData.current} / {progressData.total}
          </div>
        </div>
      )}

      {/* Checkmark for unlocked */}
      {isUnlocked && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm">✓</span>
        </div>
      )}
    </div>
  )
}
```

**Step 2: Create achievements grid**

Create `packages/frontend/src/app/stats/AchievementsGrid.tsx`:

```typescript
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/card'
import { AchievementBadge } from './AchievementBadge'
import { ACHIEVEMENTS } from './achievements'
import { GameStats } from './gameTypes'
import { UserProgress } from './types'

interface AchievementsGridProps {
  gameStats: GameStats
  progress: UserProgress
}

export function AchievementsGrid({ gameStats, progress }: AchievementsGridProps) {
  const { t } = useTranslation('stats')

  // Sort achievements: unlocked first, then by tier
  const sortedAchievements = [...ACHIEVEMENTS].sort((a, b) => {
    const aUnlocked = gameStats.achievements[a.id]?.unlocked || false
    const bUnlocked = gameStats.achievements[b.id]?.unlocked || false

    if (aUnlocked !== bUnlocked) {
      return aUnlocked ? -1 : 1
    }

    return a.tier - b.tier
  })

  return (
    <Card className="p-8 bg-white shadow-md rounded-2xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        🏅 {t('achievements.title', { defaultValue: 'Achievements' })}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedAchievements.map((achievement) => (
          <AchievementBadge
            key={achievement.id}
            achievement={achievement}
            gameStats={gameStats}
            progress={progress}
          />
        ))}
      </div>
    </Card>
  )
}
```

**Step 3: Commit**

```bash
git add packages/frontend/src/app/stats/AchievementBadge.tsx packages/frontend/src/app/stats/AchievementsGrid.tsx
git commit -m "feat(stats): add achievement components"
```

---

## Task 10: Update StatsPage with New Components

**Files:**
- Modify: `packages/frontend/src/app/stats/StatsPage.tsx:1-74`

**Step 1: Replace old stats page**

Modify `packages/frontend/src/app/stats/StatsPage.tsx`:

```typescript
import { useTranslation } from 'react-i18next'
import { PageLayout } from '@/app/common'
import { useUserData } from '@/app/account'
import { useProgress } from './useProgress'
import { LevelBadge } from './LevelBadge'
import { SubjectSkillBars } from './SubjectSkillBars'
import { CompetitiveMetrics } from './CompetitiveMetrics'
import { AchievementsGrid } from './AchievementsGrid'
import { Card } from '@/components/ui/card'

export default function StatsPage() {
  const { t } = useTranslation('stats')
  const { data } = useUserData()
  const {
    progress,
    gameStats,
    getTotalTasksOverall,
    getOverallSuccessRate
  } = useProgress()

  const totalTasks = getTotalTasksOverall()
  const overallSuccessRate = getOverallSuccessRate()

  if (totalTasks === 0) {
    return (
      <PageLayout showBack showHome showStats showAccount>
        <div className="max-w-6xl mx-auto">
          <Card className="p-12 bg-white shadow-md rounded-2xl text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('title', { defaultValue: 'Your Progress' })}
            </h1>

            {data?.settings.name && (
              <p className="text-xl text-gray-600 mb-8">
                {t('greeting', { name: data.settings.name })}
              </p>
            )}

            <div className="py-12">
              <p className="text-lg text-gray-500">
                {t('noTasksYet', { defaultValue: 'No tasks completed yet. Start learning to see your progress!' })}
              </p>
            </div>
          </Card>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout showBack showHome showStats showAccount>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {t('title', { defaultValue: 'Your Progress' })}
          </h1>
          {data?.settings.name && (
            <p className="text-xl text-gray-600">
              {t('greeting', { name: data.settings.name })}
            </p>
          )}
        </div>

        {/* Hero Section: Level Badge + Skill Bars */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LevelBadge totalTasks={totalTasks} />
          <SubjectSkillBars gameStats={gameStats} />
        </div>

        {/* Competitive Metrics */}
        <CompetitiveMetrics
          gameStats={gameStats}
          overallSuccessRate={overallSuccessRate}
        />

        {/* Achievements */}
        <AchievementsGrid gameStats={gameStats} progress={progress} />
      </div>
    </PageLayout>
  )
}
```

**Step 2: Commit**

```bash
git add packages/frontend/src/app/stats/StatsPage.tsx
git commit -m "feat(stats): update stats page with gamified components"
```

---

## Task 11: Add Translation Keys

**Files:**
- Modify: `packages/frontend/public/locales/en/stats.json`
- Modify: `packages/frontend/public/locales/de/stats.json`

**Step 1: Add English translations**

Modify `packages/frontend/public/locales/en/stats.json`:

```json
{
  "title": "Your Progress",
  "greeting": "Hi {{name}}, here's your game profile!",
  "noTasksYet": "No tasks completed yet. Start your adventure!",
  "totalTasks": "Total Tasks",
  "tasks": "tasks",
  "successRate": "Success Rate",
  "averageHints": "Avg. Hints",
  "bySubject": "Progress by Subject",
  "success": "success",
  "hints": "Hints",
  "hero": {
    "level": "Level {{level}}",
    "tasksToNext": "{{current}} / {{next}} tasks",
    "skills": "Skills"
  },
  "metrics": {
    "streak": "Streak",
    "days": "days",
    "bestStreak": "Best: {{days}}",
    "perfectRun": "Perfect Run",
    "inARow": "in a row",
    "allTimeBest": "Record: {{count}}",
    "noHints": "No-Hint Master",
    "thisWeek": "this week",
    "accuracy": "Accuracy",
    "personalBest": "Personal Best!",
    "success": "success"
  },
  "achievements": {
    "title": "Achievements",
    "unlocked": "Unlocked",
    "locked": "Locked",
    "progress": "{{current}} / {{total}}"
  },
  "empty": {
    "noStreak": "Start your streak today! 🔥",
    "noAchievements": "Complete tasks to unlock achievements!",
    "keepPracticing": "Complete tasks to level up your skills!"
  }
}
```

**Step 2: Add German translations**

Modify `packages/frontend/public/locales/de/stats.json`:

```json
{
  "title": "Dein Fortschritt",
  "greeting": "Hallo {{name}}, hier ist dein Spielprofil!",
  "noTasksYet": "Noch keine Aufgaben abgeschlossen. Starte dein Abenteuer!",
  "totalTasks": "Gesamte Aufgaben",
  "tasks": "Aufgaben",
  "successRate": "Erfolgsquote",
  "averageHints": "Ø Hinweise",
  "bySubject": "Fortschritt nach Fach",
  "success": "Erfolg",
  "hints": "Hinweise",
  "hero": {
    "level": "Level {{level}}",
    "tasksToNext": "{{current}} / {{next}} Aufgaben",
    "skills": "Fähigkeiten"
  },
  "metrics": {
    "streak": "Serie",
    "days": "Tage",
    "bestStreak": "Beste: {{days}}",
    "perfectRun": "Perfekte Serie",
    "inARow": "hintereinander",
    "allTimeBest": "Rekord: {{count}}",
    "noHints": "Ohne-Hinweise-Meister",
    "thisWeek": "diese Woche",
    "accuracy": "Genauigkeit",
    "personalBest": "Persönliche Bestleistung!",
    "success": "Erfolg"
  },
  "achievements": {
    "title": "Erfolge",
    "unlocked": "Freigeschaltet",
    "locked": "Gesperrt",
    "progress": "{{current}} / {{total}}"
  },
  "empty": {
    "noStreak": "Starte heute deine Serie! 🔥",
    "noAchievements": "Löse Aufgaben, um Erfolge freizuschalten!",
    "keepPracticing": "Löse Aufgaben, um deine Fähigkeiten zu verbessern!"
  }
}
```

**Step 3: Commit**

```bash
git add packages/frontend/public/locales/en/stats.json packages/frontend/public/locales/de/stats.json
git commit -m "feat(stats): add translation keys for gamified stats"
```

---

## Task 12: Export New Components

**Files:**
- Modify: `packages/frontend/src/app/stats/index.ts`

**Step 1: Add exports**

Modify `packages/frontend/src/app/stats/index.ts`:

```typescript
export { default as StatsPage } from './StatsPage'
export { useProgress } from './useProgress'
export { LevelBadge } from './LevelBadge'
export { SubjectSkillBars } from './SubjectSkillBars'
export { CompetitiveMetrics } from './CompetitiveMetrics'
export { AchievementsGrid } from './AchievementsGrid'
export { MetricCard } from './MetricCard'
export { AchievementBadge } from './AchievementBadge'
export * from './types'
export * from './gameTypes'
export * from './achievements'
export * as gameStatsService from './gameStatsService'
```

**Step 2: Commit**

```bash
git add packages/frontend/src/app/stats/index.ts
git commit -m "feat(stats): export new gamified components"
```

---

## Task 13: Manual Testing

**Step 1: Start development server**

```bash
docker compose up frontend-dev backend-dev
```

**Step 2: Test in browser**

Navigate to `http://localhost:5153` and:

1. Complete a few tasks to generate some stats
2. Check that level badge shows correct level and progress
3. Verify skill bars appear for subjects you've practiced
4. Confirm metric cards show correct values
5. Check achievements grid shows unlocked/locked states
6. Test responsive layout on mobile size
7. Verify animations work smoothly
8. Check both English and German translations

**Step 3: Test edge cases**

- New user with 0 tasks (should show empty state)
- User with only 1 subject (skill bars)
- User with all achievements unlocked
- Broken streak (complete task after missing a day)

**Step 4: Document any issues found**

Create issues for bugs or improvements discovered during testing.

---

## Verification

After completing all tasks:

- [ ] All TypeScript compiles without errors
- [ ] All components render without console errors
- [ ] Translations work in both EN and DE
- [ ] Responsive layout works on mobile and desktop
- [ ] Animations are smooth and performant
- [ ] GameStats persist correctly in UserData
- [ ] Achievements unlock at correct thresholds
- [ ] Streaks calculate correctly across days
- [ ] Subject mastery updates after each task
- [ ] Personal best detection works

## Notes

- No tests added in this plan (can be added later if needed)
- Focus on getting the UI working first, then optimize
- Achievement thresholds can be tweaked based on real usage
- Consider adding celebration animations for achievement unlocks in future iteration
