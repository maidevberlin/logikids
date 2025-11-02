import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Achievement } from './achievements'
import { GameStats } from './gameTypes'
import { UserProgress } from './types'

interface AchievementDetailDialogProps {
  achievement: Achievement | null
  gameStats: GameStats
  progress: UserProgress
  open: boolean
  onClose: () => void
}

export function AchievementDetailDialog({
  achievement,
  gameStats,
  progress,
  open,
  onClose
}: AchievementDetailDialogProps) {
  const { t } = useTranslation('stats')

  if (!achievement) return null

  const isUnlocked = gameStats.achievements[achievement.id]?.unlocked || false
  const unlockedDate = gameStats.achievements[achievement.id]?.date
  const progressData = achievement.getProgress(gameStats, progress)

  // Get relevant data based on achievement type
  const getDetailData = () => {
    switch (achievement.id) {
      case 'firstSteps':
      case 'scholar':
        return {
          totalTasks: Object.values(progress.stats).reduce((sum, subject) => {
            return sum + Object.values(subject).reduce((s, stats) => s + stats.correct + stats.wrong, 0)
          }, 0)
        }
      case 'dedicated':
      case 'weekWarrior':
        return {
          currentStreak: gameStats.streaks.currentDays,
          bestStreak: gameStats.streaks.bestDays,
          lastActive: gameStats.streaks.lastActiveDate
        }
      case 'sharpshooter':
        return {
          currentPerfect: gameStats.perfectRun.current,
          bestPerfect: gameStats.perfectRun.allTimeBest
        }
      case 'speedDemon':
        return {
          noHintThisWeek: gameStats.weekly.noHintTasks,
          weekStart: gameStats.weekly.weekStart
        }
      case 'polymath':
        return {
          subjects: Object.entries(gameStats.subjectMastery).map(([name, data]) => ({
            name,
            stars: data.stars
          }))
        }
      case 'master':
        return {
          subjects: Object.entries(gameStats.subjectMastery).map(([name, data]) => ({
            name,
            stars: data.stars
          }))
        }
      default:
        return {}
    }
  }

  const detailData = getDetailData()

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-4xl">{achievement.icon}</span>
            <span>
              {t(`achievements.${achievement.id}.name`, { defaultValue: achievement.name })}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Description */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-1">
              {t('achievementDetails.description', { defaultValue: 'Description' })}
            </h4>
            <p className="text-gray-600">
              {t(`achievements.${achievement.id}.description`, { defaultValue: achievement.description })}
            </p>
          </div>

          {/* Status */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-1">
              {t('achievementDetails.status', { defaultValue: 'Status' })}
            </h4>
            {isUnlocked ? (
              <div className="flex items-center gap-2 text-green-600">
                <span className="text-xl">✓</span>
                <span>
                  {t('achievementDetails.unlocked', { defaultValue: 'Unlocked' })}
                  {unlockedDate && (
                    <span className="text-gray-500 ml-2">
                      {new Date(unlockedDate).toLocaleDateString()}
                    </span>
                  )}
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-gray-600">
                  {t('achievementDetails.progress', { defaultValue: 'Progress' })}: {progressData.current} / {progressData.total}
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${(progressData.current / progressData.total) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Calculation Details */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">
              {t('achievementDetails.calculation', { defaultValue: 'Calculation' })}
            </h4>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
              {t(`achievements.${achievement.id}.calculationDetails`, {
                defaultValue: 'Details not available',
                ...detailData
              })}
            </div>
          </div>

          {/* Current Data */}
          {Object.keys(detailData).length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">
                {t('achievementDetails.currentData', { defaultValue: 'Current Data' })}
              </h4>
              <div className="bg-blue-50 rounded-xl p-4 space-y-2 text-sm">
                {achievement.id === 'firstSteps' || achievement.id === 'scholar' ? (
                  <div>
                    {t('achievementDetails.totalTasksCompleted', { defaultValue: 'Total tasks completed' })}: {detailData.totalTasks}
                  </div>
                ) : achievement.id === 'dedicated' || achievement.id === 'weekWarrior' ? (
                  <>
                    <div>
                      {t('achievementDetails.currentStreak', { defaultValue: 'Current streak' })}: {detailData.currentStreak} {t('achievementDetails.days', { defaultValue: 'days' })}
                    </div>
                    <div>
                      {t('achievementDetails.bestStreak', { defaultValue: 'Best streak' })}: {detailData.bestStreak} {t('achievementDetails.days', { defaultValue: 'days' })}
                    </div>
                  </>
                ) : achievement.id === 'sharpshooter' ? (
                  <>
                    <div>
                      {t('achievementDetails.currentPerfectRun', { defaultValue: 'Current perfect run' })}: {detailData.currentPerfect}
                    </div>
                    <div>
                      {t('achievementDetails.bestPerfectRun', { defaultValue: 'Best perfect run' })}: {detailData.bestPerfect}
                    </div>
                  </>
                ) : achievement.id === 'speedDemon' ? (
                  <div>
                    {t('achievementDetails.tasksWithoutHintsThisWeek', { defaultValue: 'Tasks without hints this week' })}: {detailData.noHintThisWeek}
                  </div>
                ) : (achievement.id === 'polymath' || achievement.id === 'master') ? (
                  <div className="space-y-1">
                    {detailData.subjects?.map(({ name, stars }) => (
                      <div key={name} className="flex justify-between items-center">
                        <span className="capitalize">{name}</span>
                        <span>{'⭐'.repeat(stars)}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* Tier */}
          <div className="pt-2 border-t">
            <span className="text-xs text-gray-500">
              {t('achievementDetails.tier', { defaultValue: 'Tier' })} {achievement.tier}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
