/**
 * Progress Service - Compatibility layer for UserData
 *
 * This service provides helper functions for progress tracking
 * and wraps the UserData core functionality.
 */

import { UserProgress, StatUpdate, Stats } from './types'
import { Difficulty } from '@/app/tasks'

/**
 * Load progress from UserData
 */
export function loadProgress(): UserProgress {
  // This is a synchronous function but UserData is async
  // We'll return empty progress and let the component handle loading
  return {
    version: 1,
    stats: {},
    lastUpdated: Date.now()
  }
}

/**
 * Save progress to UserData (no-op, UserData handles this automatically)
 */
export function saveProgress(_progress: UserProgress): void {
  // No-op: UserData handles persistence automatically
}

/**
 * Update stats for a task
 */
export function updateStats(current: UserProgress, update: StatUpdate): UserProgress {
  const { subject, difficulty, correct, hintsUsed } = update

  // Deep clone to avoid mutations
  const updated = JSON.parse(JSON.stringify(current)) as UserProgress

  // Initialize nested structure if needed
  if (!updated.stats[subject]) {
    updated.stats[subject] = {
      easy: { correct: 0, wrong: 0, hintsUsed: 0 },
      medium: { correct: 0, wrong: 0, hintsUsed: 0 },
      hard: { correct: 0, wrong: 0, hintsUsed: 0 }
    }
  }
  if (!updated.stats[subject][difficulty]) {
    updated.stats[subject][difficulty] = {
      correct: 0,
      wrong: 0,
      hintsUsed: 0
    }
  }

  // Update stats
  if (correct) {
    updated.stats[subject][difficulty].correct++
  } else {
    updated.stats[subject][difficulty].wrong++
  }
  updated.stats[subject][difficulty].hintsUsed += hintsUsed ?? 0

  updated.lastUpdated = Date.now()

  return updated
}

/**
 * Get stats for a specific subject/difficulty
 */
export function getStats(progress: UserProgress, subject: string, difficulty: Difficulty): Stats {
  return progress.stats[subject]?.[difficulty] || {
    correct: 0,
    wrong: 0,
    hintsUsed: 0
  }
}

/**
 * Get success rate for a subject/difficulty
 */
export function getSuccessRate(progress: UserProgress, subject: string, difficulty: Difficulty): number {
  const stats = getStats(progress, subject, difficulty)
  const total = stats.correct + stats.wrong

  if (total === 0) return 0

  return (stats.correct / total) * 100
}

/**
 * Get average hints used for a subject/difficulty
 */
export function getAverageHints(progress: UserProgress, subject: string, difficulty: Difficulty): number {
  const stats = getStats(progress, subject, difficulty)
  const total = stats.correct + stats.wrong

  if (total === 0) return 0

  return stats.hintsUsed / total
}
