import { GameStats } from './gameTypes'
import { ProgressData } from '@/data/progress/types'
import { TASK_LEVELS } from './levels'

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  tier: 1 | 2 | 3 | 4
  /** Minimum level required to unlock this achievement (1-indexed) */
  requiredLevel: number
  checkUnlocked: (gameStats: GameStats, progress: ProgressData) => boolean
  getProgress: (gameStats: GameStats, progress: ProgressData) => { current: number; total: number }
}

/**
 * Helper function to calculate total tasks completed (only correct answers)
 */
export function getTotalCorrectTasks(progress: ProgressData): number {
  let total = 0
  for (const subjectConcepts of Object.values(progress)) {
    for (const conceptStats of Object.values(subjectConcepts)) {
      total += conceptStats.aggregate.correct
    }
  }
  return total
}

/**
 * Get current level based on total correct tasks (1-indexed, 0 if no level yet)
 */
export function getCurrentLevel(progress: ProgressData): number {
  const totalTasks = getTotalCorrectTasks(progress)
  let level = 0
  for (let i = 0; i < TASK_LEVELS.length; i++) {
    if (totalTasks >= TASK_LEVELS[i].threshold) {
      level = i + 1 // 1-indexed
    } else {
      break
    }
  }
  return level
}

/**
 * Get the task threshold for a given level (1-indexed)
 */
export function getLevelThreshold(level: number): number {
  if (level <= 0 || level > TASK_LEVELS.length) return 0
  return TASK_LEVELS[level - 1].threshold
}

export const ACHIEVEMENTS: Achievement[] = [
  // Tier 1 - Beginner (Level 1 = 5 tasks)
  {
    id: 'firstSteps',
    name: 'First Steps',
    description: 'Complete 5 tasks',
    icon: '🌟',
    tier: 1,
    requiredLevel: 1,
    checkUnlocked: (_, progress) => getTotalCorrectTasks(progress) >= 5,
    getProgress: (_, progress) => {
      const total = getTotalCorrectTasks(progress)
      return { current: Math.min(total, 5), total: 5 }
    },
  },
  {
    id: 'dedicated',
    name: 'Dedicated',
    description: 'Maintain a 3-day streak',
    icon: '💪',
    tier: 1,
    requiredLevel: 1,
    checkUnlocked: (gameStats) => gameStats.streaks.currentDays >= 3,
    getProgress: (gameStats) => ({
      current: Math.min(gameStats.streaks.currentDays, 3),
      total: 3,
    }),
  },

  // Tier 2 - Intermediate (Level 2 = 15 tasks)
  {
    id: 'weekWarrior',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    tier: 2,
    requiredLevel: 2,
    checkUnlocked: (gameStats) => gameStats.streaks.currentDays >= 7,
    getProgress: (gameStats) => ({
      current: Math.min(gameStats.streaks.currentDays, 7),
      total: 7,
    }),
  },
  {
    id: 'sharpshooter',
    name: 'Sharpshooter',
    description: 'Complete 10 tasks with 100% accuracy',
    icon: '🎯',
    tier: 2,
    requiredLevel: 2,
    checkUnlocked: (gameStats) => gameStats.perfectRun.allTimeBest >= 10,
    getProgress: (gameStats) => ({
      current: Math.min(gameStats.perfectRun.allTimeBest, 10),
      total: 10,
    }),
  },

  // Tier 3 - Advanced (Level 3 = 30 tasks)
  {
    id: 'speedDemon',
    name: 'Speed Demon',
    description: '5 tasks without hints this week',
    icon: '⚡',
    tier: 3,
    requiredLevel: 3,
    checkUnlocked: (gameStats) => gameStats.weekly.noHintTasks >= 5,
    getProgress: (gameStats) => ({
      current: Math.min(gameStats.weekly.noHintTasks, 5),
      total: 5,
    }),
  },
  {
    id: 'polymath',
    name: 'Polymath',
    description: 'Get 3+ stars in all subjects',
    icon: '🌍',
    tier: 3,
    requiredLevel: 3,
    checkUnlocked: (gameStats) => {
      const subjects = Object.keys(gameStats.subjectMastery)
      // Require 3+ stars in at least 3 different subjects (more flexible than hardcoded 5)
      if (subjects.length < 3) return false
      return subjects.every((s) => (gameStats.subjectMastery[s]?.stars ?? 0) >= 3)
    },
    getProgress: (gameStats) => {
      const subjects = Object.keys(gameStats.subjectMastery)
      const with3Plus = subjects.filter(
        (s) => (gameStats.subjectMastery[s]?.stars ?? 0) >= 3
      ).length
      return { current: with3Plus, total: 3 }
    },
  },

  // Tier 4 - Expert (Level 4 = 50 tasks)
  {
    id: 'scholar',
    name: 'Scholar',
    description: 'Reach level 10',
    icon: '🎓',
    tier: 4,
    requiredLevel: 4,
    checkUnlocked: (_, progress) => {
      // Level 10 is at threshold 100 (from TASK_LEVELS)
      return getTotalCorrectTasks(progress) >= 100
    },
    getProgress: (_, progress) => {
      const totalTasks = getTotalCorrectTasks(progress)
      return { current: Math.min(totalTasks, 100), total: 100 }
    },
  },
  {
    id: 'master',
    name: 'Master',
    description: 'Max out (5 stars) in any subject',
    icon: '👑',
    tier: 4,
    requiredLevel: 4,
    checkUnlocked: (gameStats) => {
      return Object.values(gameStats.subjectMastery).some((m) => m.stars === 5)
    },
    getProgress: (gameStats) => {
      const maxStars = Math.max(...Object.values(gameStats.subjectMastery).map((m) => m.stars), 0)
      return { current: maxStars, total: 5 }
    },
  },
]

/**
 * Check all achievements and return newly unlocked ones.
 * Achievements are gated by level requirements - you must reach the required
 * level before an achievement can unlock.
 */
export function checkAchievements(gameStats: GameStats, progress: ProgressData): string[] {
  const newlyUnlocked: string[] = []
  const currentLevel = getCurrentLevel(progress)

  for (const achievement of ACHIEVEMENTS) {
    const wasUnlocked = gameStats.achievements[achievement.id]?.unlocked

    // Check level requirement first
    if (currentLevel < achievement.requiredLevel) {
      continue
    }

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
export function unlockAchievements(gameStats: GameStats, achievementIds: string[]): GameStats {
  const now = new Date().toISOString()
  const updatedAchievements = { ...gameStats.achievements }

  for (const id of achievementIds) {
    updatedAchievements[id] = {
      unlocked: true,
      date: now,
    }
  }

  return {
    ...gameStats,
    achievements: updatedAchievements,
  }
}
