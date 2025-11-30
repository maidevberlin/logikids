import { ConceptStats } from './types'

/**
 * Calculate 0-5 star mastery rating for a concept based on recent performance.
 * Uses last 100 attempts with "Encouraging Growth" thresholds.
 *
 * @param conceptStats - Concept statistics including attempt history
 * @returns Star rating from 0-5
 */
export function calculateConceptStars(conceptStats: ConceptStats | undefined): number {
  if (!conceptStats || conceptStats.attempts.length === 0) {
    return 0
  }

  // Take last 100 attempts
  const recentAttempts = conceptStats.attempts.slice(-100)

  // Filter out skipped attempts (correct = null)
  const scoredAttempts = recentAttempts.filter((a) => a.correct !== null)

  if (scoredAttempts.length === 0) {
    return 0
  }

  // Calculate success rate
  const correct = scoredAttempts.filter((a) => a.correct === true).length
  const successRate = correct / scoredAttempts.length

  // Map to stars using Encouraging Growth thresholds
  if (successRate === 0) return 0
  if (successRate < 0.4) return 1
  if (successRate < 0.6) return 2
  if (successRate < 0.8) return 3
  if (successRate < 0.9) return 4
  return 5
}
