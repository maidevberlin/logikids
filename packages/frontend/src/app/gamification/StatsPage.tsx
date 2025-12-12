import { useTranslation } from 'react-i18next'
import { PageLayout } from '@/app/common/PageLayout'
import { useUserData } from '@/app/user'
import { useProgress } from '@/app/progress'
import { LevelBadge } from './LevelBadge'
import { SubjectSkillBars } from './SubjectSkillBars'
import { CompetitiveMetrics } from './CompetitiveMetrics'
import { AchievementsGrid } from './AchievementsGrid'
import { Card } from '@/app/common/ui/card'

export function StatsPage() {
  const { t } = useTranslation('stats')
  const { data } = useUserData()
  const { progress, gameStats, getOverallStats } = useProgress()

  const overallStats = getOverallStats()
  const totalTasks = overallStats.totalCorrect
  const overallSuccessRate = overallStats.successRate * 100

  if (totalTasks === 0) {
    return (
      <PageLayout showBack showHome showGameStats showAccount>
        <div className="max-w-6xl mx-auto">
          <Card className="p-12 bg-card shadow-md rounded-2xl text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {t('title', { defaultValue: 'Your Progress' })}
            </h1>

            {data?.settings.name && (
              <p className="text-xl text-muted-foreground mb-8">
                {t('greeting', { name: data.settings.name })}
              </p>
            )}

            <div className="py-12">
              <p className="text-lg text-muted-foreground">
                {t('noTasksYet', {
                  defaultValue: 'No tasks completed yet. Start learning to see your progress!',
                })}
              </p>
            </div>
          </Card>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout showBack showHome showGameStats showAccount>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {t('title', { defaultValue: 'Your Progress' })}
          </h1>
          {data?.settings.name && (
            <p className="text-xl text-muted-foreground">
              {t('greeting', { name: data.settings.name })}
            </p>
          )}
        </div>

        {/* Hero Section: Level Badge + Skill Bars */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LevelBadge totalTasks={totalTasks} />
          <SubjectSkillBars gameStats={gameStats} />
        </div>

        {/* Competitive Metrics */}
        <CompetitiveMetrics gameStats={gameStats} overallSuccessRate={overallSuccessRate} />

        {/* Achievements */}
        <AchievementsGrid gameStats={gameStats} progress={progress} />
      </div>
    </PageLayout>
  )
}
