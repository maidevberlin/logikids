import { ConceptStats, Difficulty } from './types'
import { calculateDifficultyStreaks } from './aggregation'
import { t } from 'i18next'

export type DifficultyNotification = {
  type: 'level_up' | 'level_down' | 'achievement'
  message: string
  newDifficulty: Difficulty
} | null

export function adjustDifficulty(conceptStats: ConceptStats): {
  newDifficulty: Difficulty
  notification: DifficultyNotification
} {
  const { correctStreak, incorrectStreak } = calculateDifficultyStreaks(conceptStats.attempts)
  const currentDifficulty = conceptStats.difficulty || 'medium'

  let newDifficulty = currentDifficulty
  let notification: DifficultyNotification = null

  // Check for level up (3 consecutive first-try-correct)
  if (correctStreak >= 3) {
    if (currentDifficulty === 'easy') {
      newDifficulty = 'medium'
      notification = {
        type: 'level_up',
        message: t('difficulty.levelUp.medium'),
        newDifficulty: 'medium',
      }
    } else if (currentDifficulty === 'medium') {
      newDifficulty = 'hard'
      notification = {
        type: 'level_up',
        message: t('difficulty.levelUp.hard'),
        newDifficulty: 'hard',
      }
    } else {
      // Already at hard
      notification = {
        type: 'achievement',
        message: t('difficulty.achievement.masteringHard'),
        newDifficulty: 'hard',
      }
    }
  }

  // Check for level down (2 consecutive skips)
  if (incorrectStreak >= 2) {
    if (currentDifficulty === 'hard') {
      newDifficulty = 'medium'
      notification = {
        type: 'level_down',
        message: t('difficulty.levelDown.medium'),
        newDifficulty: 'medium',
      }
    } else if (currentDifficulty === 'medium') {
      newDifficulty = 'easy'
      notification = {
        type: 'level_down',
        message: t('difficulty.levelDown.easy'),
        newDifficulty: 'easy',
      }
    } else {
      // Already at easy
      notification = {
        type: 'achievement',
        message: t('difficulty.achievement.practicingEasy'),
        newDifficulty: 'easy',
      }
    }
  }

  return { newDifficulty, notification }
}
