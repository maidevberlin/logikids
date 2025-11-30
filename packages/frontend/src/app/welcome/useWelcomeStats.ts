import { useMemo } from 'react'
import { useUserData } from '@/app/account'
import type { UserData } from '@/data/core/types'

export interface WelcomeStats {
  streak: number
  level: number
  achievement: string | null
}

/**
 * Hook to calculate welcome page statistics
 */
export function useWelcomeStats(): WelcomeStats {
  const { data } = useUserData()

  return useMemo(() => {
    if (!data) {
      return {
        streak: 0,
        level: 0,
        achievement: null,
      }
    }

    // Get current streak
    const streak = data.gameStats?.streaks?.currentDays || 0

    // Calculate average mastery level across all subjects
    const subjectMastery = data.gameStats?.subjectMastery || {}
    const subjects = Object.values(subjectMastery)

    let totalStars = 0
    let subjectCount = 0

    subjects.forEach((mastery) => {
      if (mastery.stars > 0) {
        totalStars += mastery.stars
        subjectCount++
      }
    })

    const level = subjectCount > 0 ? Math.round(totalStars / subjectCount) : 0

    // Determine latest achievement
    const achievement = getLatestAchievement(data)

    return { streak, level, achievement }
  }, [data])
}

/**
 * Helper to determine the latest achievement based on gameStats
 */
function getLatestAchievement(data: UserData): string | null {
  if (!data.gameStats) return null

  const { streaks, perfectRun, weekly } = data.gameStats

  // Check for streak milestones
  if (streaks?.currentDays >= 30) return 'welcome.achievements.streak30'
  if (streaks?.currentDays >= 14) return 'welcome.achievements.streak14'
  if (streaks?.currentDays >= 7) return 'welcome.achievements.streak7'
  if (streaks?.currentDays >= 3) return 'welcome.achievements.streak3'

  // Check for perfect run achievements
  if (perfectRun?.current >= 20) return 'welcome.achievements.perfect20'
  if (perfectRun?.current >= 10) return 'welcome.achievements.perfect10'
  if (perfectRun?.current >= 5) return 'welcome.achievements.perfect5'

  // Check for weekly achievements
  if (weekly?.noHintTasks >= 10) return 'welcome.achievements.noHints10'
  if (weekly?.noHintTasks >= 5) return 'welcome.achievements.noHints5'

  // Check for total task milestones
  let totalTasks = 0
  const progress = data.progress || {}
  for (const subjectConcepts of Object.values(progress)) {
    for (const conceptStats of Object.values(subjectConcepts)) {
      totalTasks += conceptStats.aggregate?.totalAttempts || 0
    }
  }

  if (totalTasks >= 100) return 'welcome.achievements.tasks100'
  if (totalTasks >= 50) return 'welcome.achievements.tasks50'
  if (totalTasks >= 20) return 'welcome.achievements.tasks20'
  if (totalTasks >= 10) return 'welcome.achievements.tasks10'

  return null
}
