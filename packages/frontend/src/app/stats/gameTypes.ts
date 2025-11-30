import { SubjectMastery } from '@/data/progress/types'

export interface GameStats {
  version: 1

  streaks: {
    currentDays: number
    bestDays: number
    lastActiveDate: string  // ISO date string (UTC)
  }

  perfectRun: {
    current: number
    allTimeBest: number
  }

  weekly: {
    noHintTasks: number
    weekStart: string  // ISO date of Monday
  }

  personalBests: {
    successRate: number
  }

  achievements: {
    [achievementId: string]: {
      unlocked: boolean
      date?: string  // ISO timestamp
    }
  }

  subjectMastery: {
    [subject: string]: SubjectMastery
  }
}
