import { useCallback } from 'react'
import { useUserData } from '@/app/account'
import { ProgressData, ConceptStats, SubjectMastery } from './types'
import { TaskSubmissionData, addAttempt } from './progressUpdater'
import { createLogger } from '@/lib/logger'

/**
 * Main hook for progress tracking
 */
export function useProgress() {
  const logger = createLogger('useProgress')
  const { data, updateProgress, updateGameStats } = useUserData()

  const progress: ProgressData = data?.progress || {}
  const gameStats = data?.gameStats

  /**
   * Submit a task attempt
   */
  const submitTaskAttempt = useCallback(
    async (submission: TaskSubmissionData) => {
      if (!data) {
        logger.error('No user data available')
        return
      }

      const { progress: updatedProgress, gameStats: updatedGameStats } = addAttempt(
        progress,
        gameStats,
        submission
      )

      await updateProgress(updatedProgress)
      await updateGameStats(updatedGameStats)
    },
    [data, progress, gameStats, updateProgress, updateGameStats]
  )

  /**
   * Get concept stats for a specific concept
   */
  const getConceptStats = useCallback(
    (subject: string, conceptId: string): ConceptStats | null => {
      return progress[subject]?.[conceptId] || null
    },
    [progress]
  )

  /**
   * Get all concepts for a subject
   */
  const getSubjectConcepts = useCallback(
    (subject: string): Record<string, ConceptStats> => {
      return progress[subject] || {}
    },
    [progress]
  )

  /**
   * Get subject mastery
   */
  const getSubjectMastery = useCallback(
    (subject: string): SubjectMastery | null => {
      return gameStats?.subjectMastery[subject] || null
    },
    [gameStats]
  )

  /**
   * Get all subjects that have been attempted
   */
  const getAttemptedSubjects = useCallback((): string[] => {
    return Object.keys(progress)
  }, [progress])

  /**
   * Get weak concepts across all subjects (success rate < threshold)
   */
  const getWeakConcepts = useCallback(
    (threshold = 0.5): Array<{
      subject: string
      conceptId: string
      stats: ConceptStats
    }> => {
      const weak: Array<{
        subject: string
        conceptId: string
        stats: ConceptStats
      }> = []

      for (const [subject, concepts] of Object.entries(progress)) {
        for (const [conceptId, stats] of Object.entries(concepts)) {
          // Safety check: ensure aggregate exists
          if (!stats?.aggregate) continue

          if (stats.aggregate.totalAttempts >= 3 && stats.aggregate.successRate < threshold) {
            weak.push({ subject, conceptId, stats })
          }
        }
      }

      return weak.sort((a, b) => a.stats.aggregate.successRate - b.stats.aggregate.successRate)
    },
    [progress]
  )

  /**
   * Get overall statistics across all subjects
   */
  const getOverallStats = useCallback(() => {
    let totalAttempts = 0
    let totalCorrect = 0
    let totalHints = 0
    let totalTime = 0

    for (const concepts of Object.values(progress)) {
      for (const stats of Object.values(concepts)) {
        totalAttempts += stats.aggregate.totalAttempts
        totalCorrect += stats.aggregate.correct
        totalHints += stats.aggregate.totalHintsUsed
        totalTime += stats.aggregate.totalTimeSeconds
      }
    }

    return {
      totalAttempts,
      totalCorrect,
      totalWrong: totalAttempts - totalCorrect,
      successRate: totalAttempts > 0 ? totalCorrect / totalAttempts : 0,
      averageHintsPerTask: totalAttempts > 0 ? totalHints / totalAttempts : 0,
      averageTimePerTask: totalAttempts > 0 ? totalTime / totalAttempts : 0
    }
  }, [progress])

  return {
    progress,
    gameStats,
    submitTaskAttempt,
    getConceptStats,
    getSubjectConcepts,
    getSubjectMastery,
    getAttemptedSubjects,
    getWeakConcepts,
    getOverallStats
  }
}
