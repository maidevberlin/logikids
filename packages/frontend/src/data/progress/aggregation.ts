import { AttemptData, ConceptAggregate, ConceptStats, SubjectMastery } from './types'

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000

/**
 * Calculate aggregate statistics from attempts array
 */
export function calculateConceptAggregate(attempts: AttemptData[]): ConceptAggregate {
  if (attempts.length === 0) {
    return {
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

  const correct = attempts.filter(a => a.correct === true).length
  const wrong = attempts.filter(a => a.correct === false).length
  const skipped = attempts.filter(a => a.skipped).length
  const totalTime = attempts.reduce((sum, a) => sum + a.timeSeconds, 0)
  const totalHints = attempts.reduce((sum, a) => sum + a.hintsUsed, 0)
  const timestamps = attempts.map(a => a.timestamp)

  // Success rate only counts answered tasks (not skipped)
  const answeredTasks = correct + wrong
  const successRate = answeredTasks > 0 ? correct / answeredTasks : 0

  return {
    totalAttempts: attempts.length,
    correct,
    wrong,
    skipped,
    totalHintsUsed: totalHints,
    totalTimeSeconds: totalTime,
    averageTimeSeconds: totalTime / attempts.length,
    successRate,
    lastAttemptTimestamp: Math.max(...timestamps),
    firstAttemptTimestamp: Math.min(...timestamps)
  }
}

/**
 * Calculate subject mastery from all concepts in that subject
 */
export function calculateSubjectMastery(
  conceptStats: Record<string, ConceptStats>
): SubjectMastery {
  const concepts = Object.values(conceptStats)

  if (concepts.length === 0) {
    return {
      stars: 0,
      totalTasks: 0,
      successRate: 0,
      averageTimeSeconds: 0,
      conceptsMastered: 0,
      conceptsInProgress: 0,
      conceptsNeedingHelp: 0,
      lastCalculated: Date.now()
    }
  }

  const totalAttempts = concepts.reduce((sum, c) => sum + c.aggregate.totalAttempts, 0)
  const totalCorrect = concepts.reduce((sum, c) => sum + c.aggregate.correct, 0)
  const totalTime = concepts.reduce((sum, c) => sum + c.aggregate.totalTimeSeconds, 0)
  const successRate = totalCorrect / totalAttempts

  // Classify concepts by performance
  const mastered = concepts.filter(c => c.aggregate.successRate >= 0.8).length
  const needingHelp = concepts.filter(c => c.aggregate.successRate < 0.5).length
  const inProgress = concepts.length - mastered - needingHelp

  return {
    stars: calculateStars(successRate),
    totalTasks: totalAttempts,
    successRate,
    averageTimeSeconds: totalTime / totalAttempts,
    conceptsMastered: mastered,
    conceptsInProgress: inProgress,
    conceptsNeedingHelp: needingHelp,
    lastCalculated: Date.now()
  }
}

/**
 * Calculate star rating (0-5) based on success rate
 */
export function calculateStars(successRate: number): number {
  if (successRate >= 0.95) return 5
  if (successRate >= 0.85) return 4
  if (successRate >= 0.70) return 3
  if (successRate >= 0.50) return 2
  if (successRate >= 0.30) return 1
  return 0
}

/**
 * Prune attempts older than one year
 * Returns new ConceptStats with only recent attempts
 */
export function pruneOldAttempts(stats: ConceptStats): ConceptStats {
  const cutoff = Date.now() - ONE_YEAR_MS
  const recentAttempts = stats.attempts.filter(a => a.timestamp >= cutoff)

  // If no change, return original
  if (recentAttempts.length === stats.attempts.length) {
    return stats
  }

  return {
    attempts: recentAttempts,
    aggregate: calculateConceptAggregate(recentAttempts)
  }
}

/**
 * Check if attempt is duplicate (same timestamp, correct, hints within 5 seconds)
 */
export function isDuplicate(stats: ConceptStats, attempt: AttemptData): boolean {
  return stats.attempts.some(a =>
    a.id === attempt.id ||
    (Math.abs(a.timestamp - attempt.timestamp) < 5000 && // Within 5 seconds
     a.correct === attempt.correct &&
     a.hintsUsed === attempt.hintsUsed)
  )
}

/**
 * Generate unique attempt ID
 */
export function generateAttemptId(
  subject: string,
  conceptId: string,
  timestamp: number
): string {
  const randomPart = Math.random().toString(36).substring(2, 11)
  return `${subject}-${conceptId}-${timestamp}-${randomPart}`
}
