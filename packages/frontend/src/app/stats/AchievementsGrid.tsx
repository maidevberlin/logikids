import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/card'
import { AchievementBadge } from './AchievementBadge'
import { ACHIEVEMENTS } from './achievements'
import { GameStats } from './gameTypes'
import { UserProgress } from './types'

interface AchievementsGridProps {
  gameStats: GameStats
  progress: UserProgress
}

export function AchievementsGrid({ gameStats, progress }: AchievementsGridProps) {
  const { t } = useTranslation('stats')

  // Sort achievements: unlocked first, then by tier
  const sortedAchievements = [...ACHIEVEMENTS].sort((a, b) => {
    const aUnlocked = gameStats.achievements[a.id]?.unlocked || false
    const bUnlocked = gameStats.achievements[b.id]?.unlocked || false

    if (aUnlocked !== bUnlocked) {
      return aUnlocked ? -1 : 1
    }

    return a.tier - b.tier
  })

  return (
    <Card className="p-8 bg-white shadow-md rounded-2xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        🏅 {t('achievements.title', { defaultValue: 'Achievements' })}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedAchievements.map((achievement) => (
          <AchievementBadge
            key={achievement.id}
            achievement={achievement}
            gameStats={gameStats}
            progress={progress}
          />
        ))}
      </div>
    </Card>
  )
}
