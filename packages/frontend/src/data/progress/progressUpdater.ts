import {
  AttemptData,
  Difficulty,
  ProgressData
} from './types'
import {
  calculateConceptAggregate,
  calculateSubjectMastery,
  isDuplicate,
  generateAttemptId,
  pruneOldAttempts
} from './aggregation'
import { GameStats } from '@/app/stats/gameTypes'

export interface TaskSubmissionData {
  subject: string
  conceptId: string
  difficulty: Difficulty
  correct: boolean | null  // null if skipped
  hintsUsed: number
  startTime: number
  skipped?: boolean  // Optional, defaults to false
}

/**
 * Add a new attempt to progress data
 * Returns updated progress and gameStats
 */
export function addAttempt(
  progress: ProgressData,
  gameStats: GameStats | undefined,
  submission: TaskSubmissionData
): { progress: ProgressData; gameStats: GameStats } {
  const endTime = Date.now()
  const timeSeconds = Math.floor((endTime - submission.startTime) / 1000)

  const attempt: AttemptData = {
    id: generateAttemptId(submission.subject, submission.conceptId, endTime),
    difficulty: submission.difficulty,
    correct: submission.correct,
    hintsUsed: submission.hintsUsed,
    timeSeconds,
    timestamp: endTime,
    skipped: submission.skipped || false
  }

  // Initialize subject if needed
  if (!progress[submission.subject]) {
    progress[submission.subject] = {}
  }

  // Initialize concept if needed
  if (!progress[submission.subject][submission.conceptId]) {
    progress[submission.subject][submission.conceptId] = {
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
  }

  const conceptStats = progress[submission.subject][submission.conceptId]

  // Check for duplicates
  if (isDuplicate(conceptStats, attempt)) {
    console.warn('[Progress] Duplicate attempt detected, skipping')
    return { progress, gameStats: gameStats || createDefaultGameStats() }
  }

  // Add new attempt
  conceptStats.attempts.push(attempt)

  // Prune old attempts (older than 1 year)
  const pruned = pruneOldAttempts(conceptStats)
  progress[submission.subject][submission.conceptId] = pruned

  // Recalculate aggregates
  pruned.aggregate = calculateConceptAggregate(pruned.attempts)

  // Update gameStats
  const updatedGameStats = updateGameStats(gameStats, progress, attempt)

  return {
    progress,
    gameStats: updatedGameStats
  }
}

/**
 * Update gameStats based on new attempt
 */
function updateGameStats(
  currentStats: GameStats | undefined,
  progress: ProgressData,
  attempt: AttemptData
): GameStats {
  const stats = currentStats || createDefaultGameStats()

  // Recalculate all subject mastery
  stats.subjectMastery = {}
  for (const [subject, concepts] of Object.entries(progress)) {
    stats.subjectMastery[subject] = calculateSubjectMastery(concepts)
  }

  // Update streaks
  updateStreaks(stats, attempt)

  // Update perfect run
  updatePerfectRun(stats, attempt)

  // Update weekly no-hint challenge
  updateWeeklyNoHint(stats, attempt)

  // Update personal bests
  updatePersonalBests(stats, progress)

  return stats
}

/**
 * Update daily streak based on attempt
 */
function updateStreaks(stats: GameStats, attempt: AttemptData): void {
  if (attempt.skipped || !attempt.correct) return // Don't count skips or wrong answers

  const today = new Date(attempt.timestamp).toISOString().split('T')[0]
  const lastActive = stats.streaks.lastActiveDate

  if (lastActive === today) {
    // Same day, no change
    return
  }

  const yesterday = new Date(attempt.timestamp)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  if (lastActive === yesterdayStr) {
    // Consecutive day
    stats.streaks.currentDays++
    stats.streaks.bestDays = Math.max(stats.streaks.bestDays, stats.streaks.currentDays)
  } else if (lastActive === '') {
    // First ever attempt
    stats.streaks.currentDays = 1
    stats.streaks.bestDays = 1
  } else {
    // Streak broken
    stats.streaks.currentDays = 1
  }

  stats.streaks.lastActiveDate = today
}

/**
 * Update perfect run (consecutive correct answers)
 */
function updatePerfectRun(stats: GameStats, attempt: AttemptData): void {
  if (attempt.skipped) return // Don't count skips

  if (attempt.correct) {
    stats.perfectRun.current++
    stats.perfectRun.allTimeBest = Math.max(
      stats.perfectRun.allTimeBest,
      stats.perfectRun.current
    )
  } else {
    stats.perfectRun.current = 0
  }
}

/**
 * Update weekly no-hint challenge
 */
function updateWeeklyNoHint(stats: GameStats, attempt: AttemptData): void {
  if (attempt.skipped) return // Don't count skips

  const attemptDate = new Date(attempt.timestamp)
  const monday = getMonday(attemptDate)
  const mondayStr = monday.toISOString().split('T')[0]

  // Check if we're in a new week
  if (stats.weekly.weekStart !== mondayStr) {
    // New week, reset counter
    stats.weekly.noHintTasks = 0
    stats.weekly.weekStart = mondayStr
  }

  // Increment if correct and no hints used
  if (attempt.correct && attempt.hintsUsed === 0) {
    stats.weekly.noHintTasks++
  }
}

/**
 * Update personal bests
 */
function updatePersonalBests(stats: GameStats, progress: ProgressData): void {
  let totalCorrect = 0
  let totalAttempts = 0

  for (const concepts of Object.values(progress)) {
    for (const conceptStats of Object.values(concepts)) {
      totalCorrect += conceptStats.aggregate.correct
      totalAttempts += conceptStats.aggregate.totalAttempts
    }
  }

  if (totalAttempts > 0) {
    const successRate = totalCorrect / totalAttempts
    stats.personalBests.successRate = Math.max(
      stats.personalBests.successRate,
      successRate
    )
  }
}

/**
 * Get Monday of the week for a given date
 */
function getMonday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * Create default GameStats
 */
function createDefaultGameStats(): GameStats {
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
