import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Achievement, getCurrentLevel, getLevelThreshold } from './achievements'
import { GameStats } from './gameTypes'
import { ProgressData } from '@/app/progress'
import { AchievementDetailDialog } from './AchievementDetailDialog'

interface AchievementBadgeProps {
  achievement: Achievement
  gameStats: GameStats
  progress: ProgressData
}

export function AchievementBadge({ achievement, gameStats, progress }: AchievementBadgeProps) {
  const { t } = useTranslation('stats')
  const [showDialog, setShowDialog] = useState(false)
  const isUnlocked = gameStats.achievements[achievement.id]?.unlocked || false
  const progressData = achievement.getProgress(gameStats, progress)
  const progressPercent = (progressData.current / progressData.total) * 100

  // Check if achievement is level-gated
  const currentLevel = getCurrentLevel(progress)
  const isLevelLocked = currentLevel < achievement.requiredLevel
  const requiredTasks = getLevelThreshold(achievement.requiredLevel)

  return (
    <>
      <div
        onClick={() => setShowDialog(true)}
        className={`
          relative p-6 rounded-2xl border-2 transition-all duration-200 cursor-pointer
          ${
            isUnlocked
              ? 'bg-card border-border shadow-md hover:shadow-lg hover:scale-105'
              : 'bg-muted border-border opacity-60 hover:opacity-80'
          }
        `}
      >
        {/* Icon */}
        <div className={`text-5xl mb-3 text-center ${isUnlocked ? '' : 'grayscale'}`}>
          {achievement.icon}
        </div>

        {/* Name */}
        <div
          className={`text-center font-bold mb-1 ${isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}
        >
          {t(`achievements.${achievement.id}.name`, { defaultValue: achievement.name })}
        </div>

        {/* Description */}
        <div
          className={`text-sm text-center mb-3 ${isUnlocked ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}
        >
          {t(`achievements.${achievement.id}.description`, {
            defaultValue: achievement.description,
          })}
        </div>

        {/* Progress bar for locked achievements */}
        {!isUnlocked && (
          <div className="mt-4">
            {isLevelLocked ? (
              // Show level requirement
              <div className="text-xs text-muted-foreground text-center">
                {t('achievements.levelRequired', {
                  level: achievement.requiredLevel,
                  tasks: requiredTasks,
                  defaultValue: `Unlocks at Level ${achievement.requiredLevel} (${requiredTasks} tasks)`,
                })}
              </div>
            ) : (
              // Show progress bar
              <>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-400 transition-all duration-300"
                    style={{ width: `${Math.min(progressPercent, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground text-center mt-1">
                  {progressData.current} / {progressData.total}
                </div>
              </>
            )}
          </div>
        )}

        {/* Checkmark for unlocked */}
        {isUnlocked && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">✓</span>
          </div>
        )}
      </div>

      <AchievementDetailDialog
        achievement={achievement}
        gameStats={gameStats}
        progress={progress}
        open={showDialog}
        onClose={() => setShowDialog(false)}
      />
    </>
  )
}
