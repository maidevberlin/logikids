import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageLayout } from '@/app/common/PageLayout'
import { useUserData } from '@/app/user'
import { Card } from '@/app/common/ui/card'
import { Button } from '@/app/common/ui/button'
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { ComposedChart, Bar, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

function formatCost(cost: number): string {
  if (cost < 0.01) {
    return `$${cost.toFixed(4)}`
  }
  return `$${cost.toFixed(2)}`
}

function getMonthName(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

export function ParentStatsPage() {
  const { t } = useTranslation('common')
  const { data } = useUserData()
  const [monthOffset, setMonthOffset] = useState(0) // 0 = current month, -1 = last month, etc.

  const stats = useMemo(() => {
    const costs = data?.costs || []

    // Separate TTS costs from AI costs
    const ttsCosts = costs.filter((c) => c.inputTokens === 0 && c.outputTokens === 0)
    const aiCosts = costs.filter((c) => c.inputTokens > 0 || c.outputTokens > 0)

    // Total cost
    const totalCost = costs.reduce((sum, c) => sum + (c.cost || 0), 0)

    // AI costs breakdown
    const aiTotalCost = aiCosts.reduce((sum, c) => sum + (c.cost || 0), 0)
    const aiRequests = aiCosts.length

    // TTS costs
    const ttsTotalCost = ttsCosts.reduce((sum, c) => sum + (c.cost || 0), 0)
    const ttsRequests = ttsCosts.length

    // Week over week usage trend (based on request count)
    const now = Date.now()
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000
    const twoWeeksAgo = now - 14 * 24 * 60 * 60 * 1000

    const thisWeekCount = costs.filter((c) => c.timestamp > weekAgo).length
    const lastWeekCount = costs.filter(
      (c) => c.timestamp > twoWeeksAgo && c.timestamp <= weekAgo
    ).length

    let usageTrendPercent = 0
    if (lastWeekCount > 0) {
      usageTrendPercent = ((thisWeekCount - lastWeekCount) / lastWeekCount) * 100
    } else if (thisWeekCount > 0) {
      usageTrendPercent = 100 // New usage this week
    }

    return {
      totalCost,
      aiTotalCost,
      aiRequests,
      ttsTotalCost,
      ttsRequests,
      usageTrendPercent,
      hasData: costs.length > 0,
    }
  }, [data?.costs])

  // Chart data for selected month with rolling 30-day average
  const chartData = useMemo(() => {
    const costs = data?.costs || []

    const now = new Date()
    const targetDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1)
    const year = targetDate.getFullYear()
    const month = targetDate.getMonth()
    const daysInMonth = getDaysInMonth(year, month)

    // Build a map of daily costs for the last 60 days (to calculate rolling avg)
    const dailyMap = new Map<string, number>()
    costs.forEach((c) => {
      const date = new Date(c.timestamp)
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
      dailyMap.set(key, (dailyMap.get(key) || 0) + (c.cost || 0))
    })

    // Build chart data with rolling 30-day average
    const chartDays: { day: number; cost: number; avg: number }[] = []

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day)
      const key = `${year}-${month}-${day}`
      const dayCost = dailyMap.get(key) || 0

      // Calculate 30-day rolling average up to this day
      let sum = 0
      let count = 0
      for (let i = 0; i < 30; i++) {
        const pastDate = new Date(currentDate)
        pastDate.setDate(pastDate.getDate() - i)
        const pastKey = `${pastDate.getFullYear()}-${pastDate.getMonth()}-${pastDate.getDate()}`
        if (dailyMap.has(pastKey)) {
          sum += dailyMap.get(pastKey)!
          count++
        }
      }
      const avg = count > 0 ? sum / count : 0 // Average of days with activity

      chartDays.push({ day, cost: dayCost, avg })
    }

    return {
      data: chartDays,
      monthName: getMonthName(targetDate),
      isCurrentMonth: monthOffset === 0,
    }
  }, [data?.costs, monthOffset])

  const canGoForward = monthOffset < 0

  if (!data) return null

  return (
    <PageLayout showBack showHome showAccount>
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-foreground">
          {t('parentStats.title', { defaultValue: 'Usage & Costs' })}
        </h1>

        {stats.hasData ? (
          <>
            {/* Chart Card */}
            <Card className="p-4 bg-card shadow-sm rounded-2xl border-0">
              {/* Usage trend */}
              {stats.usageTrendPercent !== 0 && (
                <div
                  className={`flex items-center justify-center gap-1 mb-3 text-sm ${
                    Math.abs(stats.usageTrendPercent) <= 10
                      ? 'text-gray-400'
                      : stats.usageTrendPercent > 0
                        ? 'text-green-500'
                        : 'text-orange-500'
                  }`}
                >
                  {Math.abs(stats.usageTrendPercent) <= 10 ? (
                    <Minus className="w-4 h-4" />
                  ) : stats.usageTrendPercent > 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>
                    {stats.usageTrendPercent > 0 ? '+' : ''}
                    {stats.usageTrendPercent.toFixed(0)}% usage vs last week
                  </span>
                </div>
              )}

              {/* Month navigation */}
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMonthOffset((m) => m - 1)}
                  className="p-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <span className="font-medium">{chartData.monthName}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMonthOffset((m) => m + 1)}
                  disabled={!canGoForward}
                  className="p-2"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>

              {/* Bar Chart with Average Line */}
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData.data} barCategoryGap="20%">
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                      interval={0}
                      tickFormatter={(day) => (day % 5 === 0 || day === 1 ? String(day) : '')}
                    />
                    <YAxis hide />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        formatCost(value),
                        name === 'cost' ? 'Daily' : '30d Avg',
                      ]}
                      labelFormatter={(day) => `Day ${day}`}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="cost" fill="#6366f1" radius={[2, 2, 0, 0]} />
                    <Line
                      type="monotone"
                      dataKey="avg"
                      stroke="#94a3b8"
                      strokeWidth={2}
                      dot={false}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="flex justify-center gap-4 mt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#6366f1' }} />
                  <span>Daily</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-0.5" style={{ backgroundColor: '#94a3b8' }} />
                  <span>30d Avg</span>
                </div>
              </div>
            </Card>

            {/* Costs Card */}
            <Card className="p-6 bg-card shadow-sm rounded-2xl border-0">
              <div className="text-center mb-4">
                <div className="text-sm text-muted-foreground mb-1">
                  {t('parentStats.totalSpent', { defaultValue: 'Total Spent' })}
                </div>
                <div className="text-3xl font-bold text-foreground">
                  {formatCost(stats.totalCost)}
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center py-1 border-b border-border">
                  <span className="text-muted-foreground">
                    {t('parentStats.aiTasks', { defaultValue: 'AI Tasks & Hints' })}
                  </span>
                  <span className="font-medium">
                    {formatCost(stats.aiTotalCost)}{' '}
                    <span className="text-muted-foreground">({stats.aiRequests}×)</span>
                  </span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground">
                    {t('parentStats.tts', { defaultValue: 'Text-to-Speech' })}
                  </span>
                  <span className="font-medium">
                    {formatCost(stats.ttsTotalCost)}{' '}
                    <span className="text-muted-foreground">({stats.ttsRequests}×)</span>
                  </span>
                </div>
              </div>
            </Card>
          </>
        ) : (
          <Card className="p-8 bg-card shadow-sm rounded-2xl border-0 text-center">
            <div className="text-4xl mb-4">📊</div>
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
