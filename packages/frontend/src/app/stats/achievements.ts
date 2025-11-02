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
