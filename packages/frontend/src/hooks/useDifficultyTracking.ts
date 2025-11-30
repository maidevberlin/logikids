import { useState, useCallback, useMemo } from 'react'
import { useUserData } from '@/app/account'
import { adjustDifficulty, DifficultyNotification } from '@/data/progress/difficultyAdjuster'
import { Difficulty } from '@/data/progress/types'

export function useDifficultyTracking(subject: string, conceptId: string) {
  const { data: userData, updateProgress } = useUserData()
  const [notification, setNotification] = useState<DifficultyNotification>(null)

  // Get current concept stats
  const conceptStats = useMemo(() => {
    return userData?.progress?.[subject]?.[conceptId]
  }, [userData, subject, conceptId])

  // Get current difficulty (default to medium)
  const currentDifficulty: Difficulty = conceptStats?.difficulty || 'medium'

  // Check if difficulty should adjust and update if needed
  const checkAndAdjustDifficulty = useCallback(() => {
    if (!conceptStats || !userData) return

    const { newDifficulty, notification: adjustmentNotification } = adjustDifficulty(conceptStats)

    if (adjustmentNotification) {
      setNotification(adjustmentNotification)

      // Update difficulty in userData if it changed
      if (newDifficulty !== currentDifficulty) {
        const updatedUserData = { ...userData }
        if (!updatedUserData.progress[subject]) {
          updatedUserData.progress[subject] = {}
        }
        if (!updatedUserData.progress[subject][conceptId]) {
          updatedUserData.progress[subject][conceptId] = {
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
              firstAttemptTimestamp: 0,
            },
          }
        }
        updatedUserData.progress[subject][conceptId].difficulty = newDifficulty
        updateProgress(updatedUserData.progress)
      }
    }
  }, [conceptStats, userData, currentDifficulty, subject, conceptId, updateProgress])

  const dismissNotification = useCallback(() => {
    setNotification(null)
  }, [])

  // Manually set difficulty (user override)
  const setDifficulty = useCallback(
    (newDifficulty: Difficulty) => {
      if (!userData) return

      const updatedProgress = { ...userData.progress }
      if (!updatedProgress[subject]) {
        updatedProgress[subject] = {}
      }
      if (!updatedProgress[subject][conceptId]) {
        updatedProgress[subject][conceptId] = {
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
            firstAttemptTimestamp: 0,
          },
        }
      }
      updatedProgress[subject][conceptId].difficulty = newDifficulty
      updateProgress(updatedProgress)
    },
    [userData, subject, conceptId, updateProgress]
  )

  return {
    currentDifficulty,
    notification,
    checkAndAdjustDifficulty,
    dismissNotification,
    setDifficulty,
  }
}
