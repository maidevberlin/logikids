import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { PageLayout } from '@/app/common/PageLayout'
import { useUserData } from '@/app/user'
import { Card } from '@/app/common/ui/card'
import { MetricCard } from '@/app/gamification/MetricCard'

function formatCost(cost: number): string {
  if (cost < 0.01) {
    return `$${cost.toFixed(4)}`
  }
  return `$${cost.toFixed(2)}`
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

interface CostsBySubject {
  [subject: string]: {
    totalCost: number
    totalTokens: number
    count: number
  }
}

export function ParentStatsPage() {
  const { t } = useTranslation('common')
  const { data } = useUserData()

  const stats = useMemo(() => {
    const costs = data?.costs || []

    // Total stats
    const totalCost = costs.reduce((sum, c) => sum + (c.cost || 0), 0)
    const totalInputTokens = costs.reduce((sum, c) => sum + c.inputTokens, 0)
    const totalOutputTokens = costs.reduce((sum, c) => sum + c.outputTokens, 0)
    const totalTokens = totalInputTokens + totalOutputTokens
    const totalRequests = costs.length

    // Group by subject
    const bySubject: CostsBySubject = {}
    costs.forEach((c) => {
      if (!bySubject[c.subject]) {
        bySubject[c.subject] = { totalCost: 0, totalTokens: 0, count: 0 }
      }
      bySubject[c.subject].totalCost += c.cost || 0
      bySubject[c.subject].totalTokens += (c.inputTokens || 0) + (c.outputTokens || 0)
      bySubject[c.subject].count++
    })

    // Recent costs (last 7 days)
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    const recentCosts = costs.filter((c) => c.timestamp > weekAgo)
    const weekCost = recentCosts.reduce((sum, c) => sum + (c.cost || 0), 0)

    // Average cost per request
    const avgCost = totalRequests > 0 ? totalCost / totalRequests : 0

    return {
      totalCost,
      totalInputTokens,
      totalOutputTokens,
      totalTokens,
      totalRequests,
      bySubject,
      weekCost,
      avgCost,
    }
  }, [data?.costs])

  if (!data) return null

  return (
    <PageLayout showBack showHome showAccount>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {t('parentStats.title', { defaultValue: 'Usage Statistics' })}
          </h1>
          <p className="text-muted-foreground">
            {t('parentStats.subtitle', { defaultValue: 'AI usage and cost tracking for parents' })}
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            icon="💰"
            title={t('parentStats.totalCost', { defaultValue: 'Total Cost' })}
            value={formatCost(stats.totalCost)}
            subtitle={t('parentStats.allTime', { defaultValue: 'All time' })}
            colorClass="text-green-600"
          />
          <MetricCard
            icon="📅"
            title={t('parentStats.thisWeek', { defaultValue: 'This Week' })}
            value={formatCost(stats.weekCost)}
            subtitle={t('parentStats.last7Days', { defaultValue: 'Last 7 days' })}
            colorClass="text-blue-600"
          />
          <MetricCard
            icon="🔢"
            title={t('parentStats.requests', { defaultValue: 'AI Requests' })}
            value={stats.totalRequests}
            subtitle={t('parentStats.tasksAndHints', { defaultValue: 'Tasks & hints' })}
            colorClass="text-purple-600"
          />
          <MetricCard
            icon="📊"
            title={t('parentStats.avgCost', { defaultValue: 'Avg Cost' })}
            value={formatCost(stats.avgCost)}
            subtitle={t('parentStats.perRequest', { defaultValue: 'Per request' })}
            colorClass="text-orange-600"
          />
        </div>

        {/* Token Usage */}
        <Card className="p-6 bg-card shadow-sm rounded-2xl border-0">
          <h2 className="text-xl font-semibold mb-4">
            {t('parentStats.tokenUsage', { defaultValue: 'Token Usage' })}
          </h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {formatNumber(stats.totalInputTokens)}
              </div>
              <div className="text-sm text-muted-foreground">
                {t('parentStats.inputTokens', { defaultValue: 'Input Tokens' })}
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {formatNumber(stats.totalOutputTokens)}
              </div>
              <div className="text-sm text-muted-foreground">
                {t('parentStats.outputTokens', { defaultValue: 'Output Tokens' })}
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {formatNumber(stats.totalTokens)}
              </div>
              <div className="text-sm text-muted-foreground">
                {t('parentStats.totalTokens', { defaultValue: 'Total Tokens' })}
              </div>
            </div>
          </div>
        </Card>

        {/* Cost by Subject */}
        {Object.keys(stats.bySubject).length > 0 && (
          <Card className="p-6 bg-card shadow-sm rounded-2xl border-0">
            <h2 className="text-xl font-semibold mb-4">
              {t('parentStats.bySubject', { defaultValue: 'Usage by Subject' })}
            </h2>
            <div className="space-y-3">
              {Object.entries(stats.bySubject)
                .sort(([, a], [, b]) => b.totalCost - a.totalCost)
                .map(([subject, data]) => (
                  <div
                    key={subject}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div>
                      <div className="font-medium capitalize">
                        {t(`subjects.${subject}.label`, { defaultValue: subject })}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {data.count} {t('parentStats.requestsCount', { defaultValue: 'requests' })}{' '}
                        • {formatNumber(data.totalTokens)}{' '}
                        {t('parentStats.tokens', { defaultValue: 'tokens' })}
                      </div>
                    </div>
                    <div className="text-lg font-semibold text-green-600">
                      {formatCost(data.totalCost)}
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        )}

        {/* Empty State */}
        {stats.totalRequests === 0 && (
          <Card className="p-8 bg-card shadow-sm rounded-2xl border-0 text-center">
            <div className="text-4xl mb-4">📊</div>
            <h2 className="text-xl font-semibold mb-2">
              {t('parentStats.noData', { defaultValue: 'No usage data yet' })}
            </h2>
            <p className="text-muted-foreground">
              {t('parentStats.noDataDescription', {
                defaultValue: 'Usage statistics will appear here once your child starts learning.',
              })}
            </p>
          </Card>
        )}
      </div>
    </PageLayout>
  )
}
