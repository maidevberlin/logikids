import { 
  UserProgress, 
  UserProgressSchema, 
  StatUpdate,
  TaskStats,
  DifficultyStats
} from './types'
import { Difficulty } from '../Task/types'
import { Task } from '../Task/types'
import { SubjectId } from '../Subject'

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
const ensureSubjectStats = (progress: UserProgress, subject: SubjectId): DifficultyStats => {
  if (!progress.stats[subject]) {
    progress.stats[subject] = createEmptySubjectStats()
  }
  return progress.stats[subject]
}

// Ensure difficulty stats exist
const ensureDifficultyStats = (progress: UserProgress, subject: SubjectId, difficulty: Difficulty): TaskStats => {
  const subjectStats = ensureSubjectStats(progress, subject)
  if (!subjectStats[difficulty]) {
    subjectStats[difficulty] = createEmptyTaskStats()
  }
  return subjectStats[difficulty]
}

// Load progress from storage
export const loadProgress = (): UserProgress => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return createEmptyProgress()
    }

    const parsed = JSON.parse(stored)
    const validated = UserProgressSchema.parse(parsed)
    return validated
  } catch (error) {
    console.error('Failed to load progress:', error)
    return createEmptyProgress()
  }
}

// Save progress to storage
export const saveProgress = (progress: UserProgress): void => {
  try {
    const validated = UserProgressSchema.parse(progress)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(validated))
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
  subject: SubjectId,
  difficulty: Difficulty
): TaskStats => {
  return ensureDifficultyStats(progress, subject, difficulty)
}

// Calculate success rate for a specific subject and difficulty
export const getSuccessRate = (
  progress: UserProgress,
  subject: SubjectId,
  difficulty: Difficulty
): number => {
  const stats = getStats(progress, subject, difficulty)
  const total = stats.correct + stats.wrong
  return total === 0 ? 0 : (stats.correct / total) * 100
}

// Calculate average hints used per task
export const getAverageHints = (
  progress: UserProgress,
  subject: SubjectId,
  difficulty: Difficulty
): number => {
  const stats = getStats(progress, subject, difficulty)
  const total = stats.correct + stats.wrong
  return total === 0 ? 0 : stats.hintsUsed / total
} 