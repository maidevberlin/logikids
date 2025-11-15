import { ConceptStats, Difficulty } from './types'
import { calculateDifficultyStreaks } from './aggregation'

export type DifficultyNotification = {
  type: 'level_up' | 'level_down' | 'achievement'
  message: string
  newDifficulty: Difficulty
} | null

export function adjustDifficulty(
  conceptStats: ConceptStats
): { newDifficulty: Difficulty; notification: DifficultyNotification } {
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
        message: "You've leveled up to Medium!",
        newDifficulty: 'medium'
      }
    } else if (currentDifficulty === 'medium') {
      newDifficulty = 'hard'
      notification = {
        type: 'level_up',
        message: "You've leveled up to Hard!",
        newDifficulty: 'hard'
      }
    } else {
      // Already at hard
      notification = {
        type: 'achievement',
        message: "Mastering hard level! Keep it up!",
        newDifficulty: 'hard'
      }
    }
  }

  // Check for level down (2 consecutive skips)
  if (incorrectStreak >= 2) {
    if (currentDifficulty === 'hard') {
      newDifficulty = 'medium'
      notification = {
        type: 'level_down',
        message: "Back to Medium - you've got this!",
        newDifficulty: 'medium'
      }
    } else if (currentDifficulty === 'medium') {
      newDifficulty = 'easy'
      notification = {
        type: 'level_down',
        message: "Back to Easy - practice makes perfect!",
        newDifficulty: 'easy'
      }
    } else {
      // Already at easy
      notification = {
        type: 'achievement',
        message: "Keep practicing - you're learning!",
        newDifficulty: 'easy'
      }
    }
  }

  return { newDifficulty, notification }
}
