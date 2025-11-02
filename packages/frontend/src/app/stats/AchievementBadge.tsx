import { useTranslation } from 'react-i18next'
import { Achievement } from './achievements'
import { GameStats } from './gameTypes'
import { UserProgress } from './types'

interface AchievementBadgeProps {
  achievement: Achievement
  gameStats: GameStats
  progress: UserProgress
}

export function AchievementBadge({
  achievement,
  gameStats,
  progress
}: AchievementBadgeProps) {
  const { t } = useTranslation('stats')
  const isUnlocked = gameStats.achievements[achievement.id]?.unlocked || false
  const progressData = achievement.getProgress(gameStats, progress)
  const progressPercent = (progressData.current / progressData.total) * 100

  return (
    <div
      className={`
        relative p-6 rounded-2xl border-2 transition-all duration-200
        ${isUnlocked
          ? 'bg-white border-gray-200 shadow-md hover:shadow-lg hover:scale-105'
          : 'bg-gray-50 border-gray-200 opacity-60 hover:opacity-80'
        }
      `}
    >
      {/* Icon */}
      <div className={`text-5xl mb-3 text-center ${isUnlocked ? '' : 'grayscale'}`}>
        {achievement.icon}
      </div>

      {/* Name */}
      <div className={`text-center font-bold mb-1 ${isUnlocked ? 'text-gray-900' : 'text-gray-500'}`}>
        {t(`achievements.${achievement.id}.name`, { defaultValue: achievement.name })}
      </div>

      {/* Description */}
      <div className={`text-sm text-center mb-3 ${isUnlocked ? 'text-gray-600' : 'text-gray-400'}`}>
        {t(`achievements.${achievement.id}.description`, { defaultValue: achievement.description })}
      </div>

      {/* Progress bar for locked achievements */}
      {!isUnlocked && (
        <div className="mt-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-400 transition-all duration-300"
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 text-center mt-1">
            {progressData.current} / {progressData.total}
          </div>
        </div>
      )}

      {/* Checkmark for unlocked */}
      {isUnlocked && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm">✓</span>
        </div>
      )}
    </div>
  )
}
