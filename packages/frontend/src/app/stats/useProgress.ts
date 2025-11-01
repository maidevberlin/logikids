import { useCallback, useEffect, useState } from 'react'
import { UserProgress, StatUpdate } from './types'
import * as progressService from './progressService'
import { Difficulty } from '@/app/tasks'
import { useUserData } from '@/app/account'

export function useProgress() {
  const { data, updateProgress: updateUserDataProgress } = useUserData()
  const [progress, setProgress] = useState<UserProgress>({
    version: 1,
    stats: data?.progress || {},
    lastUpdated: Date.now()
  })

  // Sync with UserData when it changes
  useEffect(() => {
    if (data?.progress) {
      setProgress({
        version: 1,
        stats: data.progress,
        lastUpdated: Date.now()
      })
    }
  }, [data?.progress])

  // Update stats for a task
  const updateStats = useCallback(async (update: StatUpdate) => {
    const updated = progressService.updateStats(progress, update)
    setProgress(updated)

    // Persist to UserData
    try {
      await updateUserDataProgress(updated.stats)
    } catch (error) {
      console.error('Failed to save progress:', error)
    }
  }, [progress, updateUserDataProgress])

  // Get success rate for a subject/difficulty
  const getSuccessRate = useCallback((subject: string, difficulty: Difficulty): number => {
    return progressService.getSuccessRate(progress, subject, difficulty)
  }, [progress])

  // Get average hints used for a subject/difficulty
  const getAverageHints = useCallback((subject: string, difficulty: Difficulty): number => {
    return progressService.getAverageHints(progress, subject, difficulty)
  }, [progress])

  // Get total tasks completed for a subject/difficulty
  const getTotalTasks = useCallback((subject: string, difficulty: Difficulty): number => {
    const stats = progressService.getStats(progress, subject, difficulty)
    return stats.correct + stats.wrong
  }, [progress])

  // Get total tasks completed across all subjects/difficulties
  const getTotalTasksOverall = useCallback((): number => {
    return Object.values(progress.stats).reduce((total, subjectStats) => {
      return total + Object.values(subjectStats).reduce((subTotal, stats) => {
        return subTotal + stats.correct + stats.wrong
      }, 0)
    }, 0)
  }, [progress])

  // Get overall success rate
  const getOverallSuccessRate = useCallback((): number => {
    let totalCorrect = 0
    let totalAttempts = 0

    Object.values(progress.stats).forEach(subjectStats => {
      Object.values(subjectStats).forEach(stats => {
        totalCorrect += stats.correct
        totalAttempts += stats.correct + stats.wrong
      })
    })

    return totalAttempts === 0 ? 0 : (totalCorrect / totalAttempts) * 100
  }, [progress])

  // Get overall average hints
  const getOverallAverageHints = useCallback((): number => {
    let totalHints = 0
    let totalTasks = 0

    Object.values(progress.stats).forEach(subjectStats => {
      Object.values(subjectStats).forEach(stats => {
        totalHints += stats.hintsUsed
        totalTasks += stats.correct + stats.wrong
      })
    })

    return totalTasks === 0 ? 0 : totalHints / totalTasks
  }, [progress])

  return {
    progress,
    updateStats,
    getSuccessRate,
    getAverageHints,
    getTotalTasks,
    getTotalTasksOverall,
    getOverallSuccessRate,
    getOverallAverageHints,
  }
} 