import { useCallback, useEffect, useState } from 'react'
import { UserProgress, StatUpdate } from './types'
import { GameStats, createDefaultGameStats } from './gameTypes'
import * as progressService from './progressService'
import * as gameStatsService from './gameStatsService'
import * as achievementsService from './achievements'
import { Difficulty } from '@/app/tasks'
import { useUserData } from '@/app/account'

export function useProgress() {
  const { data, updateProgress: updateUserDataProgress, updateGameStats: updateUserGameStats } = useUserData()
  const [progress, setProgress] = useState<UserProgress>({
    version: 1,
    stats: data?.progress || {},
    lastUpdated: Date.now()
  })
  const [gameStats, setGameStats] = useState<GameStats>(
    data?.gameStats || createDefaultGameStats()
  )

  // Sync with UserData when it changes
  useEffect(() => {
    if (data?.progress) {
      setProgress({
        version: 1,
        stats: data.progress,
        lastUpdated: Date.now()
      })
    }
    if (data?.gameStats) {
      setGameStats(data.gameStats)
    } else if (data) {
      // Initialize game stats if missing
      const defaultStats = createDefaultGameStats()
      setGameStats(defaultStats)
    }
  }, [data?.progress, data?.gameStats])

  // Update stats for a task
  const updateStats = useCallback(async (update: StatUpdate) => {
    const updated = progressService.updateStats(progress, update)
    setProgress(updated)

    // Update game stats
    const wasCorrect = update.correct ?? false
    const hintsUsed = update.hintsUsed ?? 0
    const taskDate = new Date()

    let newGameStats = gameStats

    // Update streaks
    newGameStats = gameStatsService.updateStreaks(newGameStats, taskDate, wasCorrect)

    // Update perfect run
    newGameStats = gameStatsService.updatePerfectRun(newGameStats, wasCorrect)

    // Update weekly no-hint counter
    newGameStats = gameStatsService.updateWeeklyNoHint(newGameStats, hintsUsed)

    // Update subject mastery
    const mastery = gameStatsService.calculateSubjectMastery(update.subject, updated.stats)
    newGameStats = {
      ...newGameStats,
      subjectMastery: {
        ...newGameStats.subjectMastery,
        [update.subject]: {
          stars: mastery,
          lastCalculated: new Date().toISOString()
        }
      }
    }

    // Check for personal best
    let totalCorrect = 0
    let totalAttempts = 0
    Object.values(updated.stats).forEach(subjectStats => {
      Object.values(subjectStats).forEach(stats => {
        totalCorrect += stats.correct
        totalAttempts += stats.correct + stats.wrong
      })
    })
    const newSuccessRate = totalAttempts === 0 ? 0 : (totalCorrect / totalAttempts) * 100

    if (gameStatsService.checkPersonalBest(newGameStats, newSuccessRate)) {
      newGameStats = gameStatsService.updatePersonalBest(newGameStats, newSuccessRate)
    }

    // Check achievements
    const newlyUnlocked = achievementsService.checkAchievements(newGameStats, updated)
    if (newlyUnlocked.length > 0) {
      newGameStats = achievementsService.unlockAchievements(newGameStats, newlyUnlocked)
      // TODO: Trigger celebration animation
    }

    setGameStats(newGameStats)

    // Persist both to UserData
    try {
      await updateUserDataProgress(updated.stats)
      await updateUserGameStats(newGameStats)
    } catch (error) {
      console.error('Failed to save progress:', error)
    }
  }, [progress, gameStats, updateUserDataProgress, updateUserGameStats])

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
    gameStats,
    updateStats,
    getSuccessRate,
    getAverageHints,
    getTotalTasks,
    getTotalTasksOverall,
    getOverallSuccessRate,
    getOverallAverageHints,
  }
} 