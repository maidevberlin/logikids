// Types
export type {
  Difficulty,
  AttemptData,
  ConceptAggregate,
  ConceptStats,
  SubjectMastery,
  ProgressData,
} from './types'

// Main hook
export { useProgress } from './useProgress'

// Components
export { HeaderGameStats } from './HeaderGameStats'

// Task submission
export { addAttempt } from './addAttempt'
export type { TaskSubmissionData } from './addAttempt'

// Aggregation utilities
export {
  calculateConceptAggregate,
  calculateSubjectMastery,
  calculateStars,
  calculateDifficultyStreaks,
  pruneOldAttempts,
  isDuplicate,
  generateAttemptId,
  MIN_TASKS_FOR_STARS,
} from './aggregateProgress'

// Star calculation
export { calculateConceptStars } from './calculateStars'

// Difficulty adjustment
export { adjustDifficulty } from './adjustDifficulty'
export type { DifficultyNotification } from './adjustDifficulty'

// Difficulty tracking hook
export { useDifficultyTracking } from './useDifficultyTracking'
