import { useTranslation } from 'react-i18next'
import { MetricCard } from './MetricCard'
import { GameStats } from './gameTypes'

interface CompetitiveMetricsProps {
  gameStats: GameStats
  overallSuccessRate: number
}

export function CompetitiveMetrics({
  gameStats,
  overallSuccessRate
}: CompetitiveMetricsProps) {
  const { t } = useTranslation('stats')

  const isPersonalBest = overallSuccessRate > 0 &&
    overallSuccessRate >= gameStats.personalBests.successRate

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Streak */}
      <MetricCard
        icon="🔥"
        title={t('metrics.streak', { defaultValue: 'Streak' })}
        value={gameStats.streaks.currentDays}
        subtitle={t('metrics.days', { defaultValue: 'days' })}
        highlight={t('metrics.bestStreak', {
          days: gameStats.streaks.bestDays,
          defaultValue: `Best: ${gameStats.streaks.bestDays}`
        })}
        colorClass="text-orange-600"
      />

      {/* Perfect Run */}
      <MetricCard
        icon="🏆"
        title={t('metrics.perfectRun', { defaultValue: 'Perfect Run' })}
        value={gameStats.perfectRun.current || gameStats.perfectRun.allTimeBest}
        subtitle={t('metrics.inARow', { defaultValue: 'in a row' })}
        highlight={t('metrics.allTimeBest', {
          count: gameStats.perfectRun.allTimeBest,
          defaultValue: `Record: ${gameStats.perfectRun.allTimeBest}`
        })}
        colorClass="text-yellow-600"
      />

      {/* No-Hint Master */}
      <MetricCard
        icon="⚡"
        title={t('metrics.noHints', { defaultValue: 'No-Hint Master' })}
        value={gameStats.weekly.noHintTasks}
        subtitle={t('metrics.thisWeek', { defaultValue: 'this week' })}
        colorClass="text-purple-600"
      />

      {/* Accuracy */}
      <MetricCard
        icon="🎯"
        title={t('metrics.accuracy', { defaultValue: 'Accuracy' })}
        value={`${overallSuccessRate.toFixed(1)}%`}
        subtitle={t('metrics.success', { defaultValue: 'success' })}
        highlight={isPersonalBest ? t('metrics.personalBest', { defaultValue: 'Personal Best!' }) : undefined}
        colorClass="text-green-600"
      />
    </div>
  )
}
