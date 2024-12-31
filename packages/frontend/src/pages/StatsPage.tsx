import { useTranslation } from 'react-i18next'
import { useSettings } from '../hooks/useSettings'
import { useProgress } from '../hooks/useProgress'
import { Breadcrumb } from '../components/base/Breadcrumb/Breadcrumb'
import { Heading } from '../components/base/Typography/Heading'
import { Text } from '../components/base/Typography/Text'
import { cn } from '../components/base/styles/utils'
import { container } from '../components/base/styles/common'
import { TaskProgress, PerformanceStats, SubjectStats } from '../components/Stats'
import { Page } from '../components/base/layout/Page'

export default function StatsPage() {
  const { t } = useTranslation()
  const { settings } = useSettings()
  const { 
    getTotalTasksOverall,
    getOverallSuccessRate,
    getOverallAverageHints,
    getSuccessRate,
    getTotalTasks
  } = useProgress()

  const totalTasks = getTotalTasksOverall()
  const overallSuccessRate = getOverallSuccessRate()
  const overallAverageHints = getOverallAverageHints()

  if (totalTasks === 0) {
    return (
      <Page>
        <Breadcrumb currentPage={t('stats.title')} />
        <div className="py-12">
          <div className={cn(container.base, container.maxWidth.md)}>
            <div className={cn(
              'bg-white rounded-xl shadow-xl p-8',
              'transform transition-all duration-300'
            )}>
              <Heading level={1} className="mb-8">
                {t('stats.title')}
              </Heading>

              <div className="space-y-6">
                {settings.name && (
                  <Text size="lg">
                    {t('stats.greeting', { name: settings.name })}
                  </Text>
                )}
                
                <div className="p-8 bg-gray-50 rounded-lg text-center">
                  <Text className="text-gray-600">
                    {t('stats.noTasksYet')}
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Page>
    )
  }

  return (
    <Page>
      <Breadcrumb currentPage={t('stats.title')} />
      <div className="py-12">
        <div className={cn(container.base, container.maxWidth.md)}>
          <div className={cn(
            'bg-white rounded-xl shadow-xl p-8',
            'transform transition-all duration-300'
          )}>
            <Heading level={1} className="mb-8">
              {t('stats.title')}
            </Heading>

            <div className="space-y-8">
              {settings.name && (
                <Text size="lg">
                  {t('stats.greeting', { name: settings.name })}
                </Text>
              )}

              <TaskProgress value={totalTasks} />
              
              <PerformanceStats 
                successRate={overallSuccessRate} 
                averageHints={overallAverageHints} 
              />

              <SubjectStats 
                getSuccessRate={getSuccessRate}
                getTotalTasks={getTotalTasks}
              />
            </div>
          </div>
        </div>
      </div>
    </Page>
  )
} 