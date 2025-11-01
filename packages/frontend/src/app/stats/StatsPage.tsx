import { useTranslation } from 'react-i18next'
import { PageLayout } from '@/app/common'
import { useUserData } from '@/app/account'
import { useProgress } from './useProgress'
import { TaskProgress } from './TaskProgress'
import { PerformanceStats } from './PerformanceStats'
import { Card } from '@/components/ui/card'

export default function StatsPage() {
  const { t } = useTranslation('stats')
  const { data } = useUserData()
  const {
    getTotalTasksOverall,
    getOverallSuccessRate,
    getOverallAverageHints
  } = useProgress()

  const totalTasks = getTotalTasksOverall()
  const overallSuccessRate = getOverallSuccessRate()
  const overallAverageHints = getOverallAverageHints()

  if (totalTasks === 0) {
    return (
      <PageLayout showBack showHome showAccount>
        <div className="max-w-4xl mx-auto">
          <Card className="p-12 bg-white shadow-md rounded-2xl text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('title', { defaultValue: 'Your Progress' })}
            </h1>

            {data?.settings.name && (
              <p className="text-xl text-gray-600 mb-8">
                {t('greeting', { name: data.settings.name })}
              </p>
            )}

            <div className="py-12">
              <p className="text-lg text-gray-500">
                {t('noTasksYet', { defaultValue: 'No tasks completed yet. Start learning to see your progress!' })}
              </p>
            </div>
          </Card>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout showBack showHome showAccount>
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="p-12 bg-white shadow-md rounded-2xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">
            {t('title', { defaultValue: 'Your Progress' })}
          </h1>

          {data?.settings.name && (
            <p className="text-xl text-gray-600 mb-8 text-center">
              {t('greeting', { name: data.settings.name })}
            </p>
          )}

          <div className="space-y-8">
            <TaskProgress value={totalTasks} />

            <PerformanceStats
              successRate={overallSuccessRate}
              averageHints={overallAverageHints}
            />
          </div>
        </Card>
      </div>
    </PageLayout>
  )
}
