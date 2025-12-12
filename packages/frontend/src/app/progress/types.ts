export type Difficulty = 'easy' | 'medium' | 'hard'

export interface AttemptData {
  /** Unique attempt ID for deduplication */
  id: string

  /** Difficulty level of this attempt */
  difficulty: Difficulty

  /** Whether answer was correct (null if skipped) */
  correct: boolean | null

  /** Number of hints used during this attempt */
  hintsUsed: number

  /** Time from task load to submission (seconds) */
  timeSeconds: number

  /** Unix timestamp when attempt was made */
  timestamp: number

  /** Whether this task was skipped (not answered) */
  skipped: boolean
}

export interface ConceptAggregate {
  totalAttempts: number
  correct: number
  wrong: number
  skipped: number
  totalHintsUsed: number
  totalTimeSeconds: number
  averageTimeSeconds: number
  successRate: number
  lastAttemptTimestamp: number
  firstAttemptTimestamp: number
}

export interface ConceptStats {
  /** List of all attempts for this concept */
  attempts: AttemptData[]

  /** Cached aggregate stats (recalculated on data load/save) */
  aggregate: ConceptAggregate

  /** Current adaptive difficulty level for this concept (defaults to "medium") */
  difficulty?: Difficulty
}

export interface SubjectMastery {
  stars: number // 0-5
  totalTasks: number
  successRate: number
  averageTimeSeconds: number
  conceptsMastered: number // Success rate >= 80%
  conceptsInProgress: number // 50% <= success rate < 80%
  conceptsNeedingHelp: number // Success rate < 50%
  lastCalculated: number // timestamp
}

export interface ProgressData {
  [subject: string]: {
    [conceptId: string]: ConceptStats
  }
}
