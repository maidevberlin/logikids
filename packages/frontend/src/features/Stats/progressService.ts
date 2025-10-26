import { 
  UserProgress, 
  UserProgressSchema, 
  StatUpdate,
  TaskStats,
  DifficultyStats
} from './types'
import { Difficulty } from '../Task/types'
import { Task } from '../Task/types'

const STORAGE_KEY = 'logikids_progress'

// Initialize empty stats
const createEmptyTaskStats = (): TaskStats => ({
  correct: 0,
  wrong: 0,
  hintsUsed: 0
})

// Initialize empty stats for a subject
const createEmptySubjectStats = (): DifficultyStats => ({
  easy: createEmptyTaskStats(),
  medium: createEmptyTaskStats(),
  hard: createEmptyTaskStats()
})

// Initialize empty progress
const createEmptyProgress = (): UserProgress => ({
  version: 1,
  stats: {
    math: createEmptySubjectStats(),
    logic: createEmptySubjectStats()
  },
  lastUpdated: Date.now()
})

// Ensure subject stats exist
const ensureSubjectStats = (progress: UserProgress, subject: string): DifficultyStats => {
  if (!progress.stats[subject]) {
    progress.stats[subject] = createEmptySubjectStats()
  }
  return progress.stats[subject]
}

// Ensure difficulty stats exist
const ensureDifficultyStats = (progress: UserProgress, subject: string, difficulty: Difficulty): TaskStats => {
  const subjectStats = ensureSubjectStats(progress, subject)
  if (!subjectStats[difficulty]) {
    subjectStats[difficulty] = createEmptyTaskStats()
  }
  return subjectStats[difficulty]
}

/**
 * Load progress from storage
 *
 * NOTE: This function should not be called directly from components.
 * Use useUserData() hook instead to get progress data.
 * This is kept for backward compatibility with existing code.
 */
export const loadProgress = (): UserProgress => {
  try {
    // Try to load from encrypted user data first
    const userData = localStorage.getItem('logikids_data')
    if (userData) {
      const parsed = JSON.parse(userData)
      if (parsed.progress && Object.keys(parsed.progress).length > 0) {
        return {
          version: 1,
          stats: parsed.progress,
          lastUpdated: parsed.timestamp || Date.now()
        }
      }
    }

    // Fallback to old storage key for migration
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      const validated = UserProgressSchema.parse(parsed)
      return validated
    }

    return createEmptyProgress()
  } catch (error) {
    console.error('Failed to load progress:', error)
    return createEmptyProgress()
  }
}

/**
 * Save progress to storage
 *
 * NOTE: This function should not be called directly from components.
 * Use useUserData().updateProgress() instead to ensure proper encryption and sync.
 * This is kept for backward compatibility with existing code.
 */
export const saveProgress = (progress: UserProgress): void => {
  try {
    const validated = UserProgressSchema.parse(progress)

    // Update encrypted user data if exists
    const userData = localStorage.getItem('logikids_data')
    if (userData) {
      const parsed = JSON.parse(userData)
      parsed.progress = validated.stats
      parsed.timestamp = Date.now()
      localStorage.setItem('logikids_data', JSON.stringify(parsed))

      // Trigger sync event
      window.dispatchEvent(new CustomEvent('data-synced', { detail: parsed }))
    } else {
      // Fallback to old storage for non-authenticated users
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validated))
    }
  } catch (error) {
    console.error('Failed to save progress:', error)
    throw new Error('Failed to save progress')
  }
}

// Helper to check if an answer is correct
// this needs to be replaced with useTaskAnswer or useTask. they should have a check.
export const isAnswerCorrect = (task: Task, selectedAnswer: number | null): boolean => {
  if (selectedAnswer === null) return false;
  if (task.type === 'multiple_choice') {
    return task.options[selectedAnswer].isCorrect;
  }
  return selectedAnswer === (task.solution.answer ? 1 : 0);
}

// Update stats for a specific task
export const updateStats = (
  currentProgress: UserProgress,
  update: StatUpdate
): UserProgress => {
  const { subject, difficulty, correct, hintsUsed = 0 } = update
  
  // Ensure stats exist and get current values
  const currentStats = ensureDifficultyStats(currentProgress, subject, difficulty)
  
  // Create a new progress object
  const newProgress: UserProgress = {
    ...currentProgress,
    lastUpdated: Date.now(),
    stats: {
      ...currentProgress.stats,
      [subject]: {
        ...ensureSubjectStats(currentProgress, subject),
        [difficulty]: {
          ...currentStats,
          correct: correct ? currentStats.correct + 1 : currentStats.correct,
          wrong: correct === false ? currentStats.wrong + 1 : currentStats.wrong,
          hintsUsed: currentStats.hintsUsed + hintsUsed,
        },
      },
    },
  }

  return newProgress
}

// Get stats for a specific subject and difficulty
export const getStats = (
  progress: UserProgress,
  subject: string,
  difficulty: Difficulty
): TaskStats => {
  return ensureDifficultyStats(progress, subject, difficulty)
}

// Calculate success rate for a specific subject and difficulty
export const getSuccessRate = (
  progress: UserProgress,
  subject: string,
  difficulty: Difficulty
): number => {
  const stats = getStats(progress, subject, difficulty)
  const total = stats.correct + stats.wrong
  return total === 0 ? 0 : (stats.correct / total) * 100
}

// Calculate average hints used per task
export const getAverageHints = (
  progress: UserProgress,
  subject: string,
  difficulty: Difficulty
): number => {
  const stats = getStats(progress, subject, difficulty)
  const total = stats.correct + stats.wrong
  return total === 0 ? 0 : stats.hintsUsed / total
} 