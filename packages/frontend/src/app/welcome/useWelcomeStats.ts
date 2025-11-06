import { useMemo } from 'react'
import { useUserData } from '@/app/account'
import { calculateSubjectMastery } from '@/app/stats/gameStatsService'

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
        achievement: null
      }
    }

    // Get current streak
    const streak = data.gameStats?.streaks?.currentDays || 0

    // Calculate average mastery level across all subjects
    const subjects = Object.keys(data.progress || {})
    let totalStars = 0
    let subjectCount = 0

    subjects.forEach(subject => {
      const mastery = calculateSubjectMastery(subject, data.progress)
      if (mastery > 0) {
        totalStars += mastery
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
function getLatestAchievement(data: any): string | null {
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
  const totalTasks = Object.values(data.progress || {}).reduce((sum: number, subjectStats: any) => {
    return sum + Object.values(subjectStats || {}).reduce((subSum: number, diffStats: any) => {
      return subSum + (diffStats?.correct || 0) + (diffStats?.wrong || 0)
    }, 0)
  }, 0)

  if (totalTasks >= 100) return 'welcome.achievements.tasks100'
  if (totalTasks >= 50) return 'welcome.achievements.tasks50'
  if (totalTasks >= 20) return 'welcome.achievements.tasks20'
  if (totalTasks >= 10) return 'welcome.achievements.tasks10'

  return null
}
