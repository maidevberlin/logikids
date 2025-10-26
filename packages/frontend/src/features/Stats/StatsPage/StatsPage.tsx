import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import { useUserData } from '../../UserData'
import { useProgress } from '../useProgress'
import { Breadcrumb } from '../../base/Breadcrumb/Breadcrumb'
import { Heading } from '../../base/Typography/Heading'
import { Text } from '../../base/Typography/Text'
import { cn } from '../../../utils'
import { styles as containerStyles } from '../../base/Layout/Container/styles'
import { TaskProgress, PerformanceStats } from '..'
import { Page } from '../../base/Layout'
import { styles } from './styles'
import type { StatsPageProps } from './types'

export default function StatsPage({}: StatsPageProps) {
  const { t } = useTranslation()
  const { data } = useUserData()
  const {
    getTotalTasksOverall,
    getOverallSuccessRate,
    getOverallAverageHints
  } = useProgress()

  const totalTasks = getTotalTasksOverall()
  const overallSuccessRate = getOverallSuccessRate()
  const overallAverageHints = getOverallAverageHints()

  const navigation = useMemo(() => (
    <Breadcrumb currentPage={t('stats.title')} />
  ), [t])

  if (totalTasks === 0) {
    return (
      <Page navigation={navigation}>
        <div className={styles.container}>
          <div className={cn(containerStyles.base, containerStyles.sizes.md)}>
            <div className={styles.card}>
              <Heading level={1} className={styles.title}>
                {t('stats.title')}
              </Heading>

              <div className={styles.content}>
                {data?.settings.name && (
                  <Text className={styles.greeting}>
                    {t('stats.greeting', { name: data.settings.name })}
                  </Text>
                )}

                <div className={styles.emptyState}>
                  <Text className={styles.secondaryText}>
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
    <Page navigation={navigation}>
      <div className={styles.container}>
        <div className={cn(containerStyles.base, containerStyles.sizes.md)}>
          <div className={styles.card}>
            <Heading level={1} className={styles.title}>
              {t('stats.title')}
            </Heading>

            <div className={styles.content}>
              {data?.settings.name && (
                <Text className={styles.greeting}>
                  {t('stats.greeting', { name: data.settings.name })}
                </Text>
              )}

              <TaskProgress value={totalTasks} />

              <PerformanceStats
                successRate={overallSuccessRate}
                averageHints={overallAverageHints}
              />
            </div>
          </div>
        </div>
      </div>
    </Page>
  )
} 