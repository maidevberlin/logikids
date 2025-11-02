import { GameStats, getMonday } from './gameTypes'
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
  return 1  // Any tasks completed = 1 star minimum
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
