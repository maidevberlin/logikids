import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/card'

export interface PerformanceStatsProps {
  successRate: number
  averageHints: number
}

export function PerformanceStats({ successRate, averageHints }: PerformanceStatsProps) {
  const { t } = useTranslation('stats')

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600'
    if (rate >= 60) return 'text-blue-600'
    if (rate >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getHintColor = (hints: number) => {
    if (hints <= 1) return 'text-green-600'
    if (hints <= 2) return 'text-blue-600'
    if (hints <= 3) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Success Rate */}
      <Card className="p-6 bg-card shadow-sm rounded-2xl border-0">
        <div className="text-center space-y-4">
          <h3 className="text-base font-medium text-foreground">
            {t('successRate', { defaultValue: 'Success Rate' })}
          </h3>
          <div className={`text-5xl font-bold ${getSuccessRateColor(successRate)}`}>
            {successRate.toFixed(1)}%
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                successRate >= 80 ? 'bg-green-500' :
                successRate >= 60 ? 'bg-blue-500' :
                successRate >= 40 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${successRate}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Average Hints */}
      <Card className="p-6 bg-card shadow-sm rounded-2xl border-0">
        <div className="text-center space-y-4">
          <h3 className="text-base font-medium text-foreground">
            {t('averageHints', { defaultValue: 'Average Hints Used' })}
          </h3>
          <div className={`text-5xl font-bold ${getHintColor(averageHints)}`}>
            {averageHints.toFixed(1)}
          </div>
          <div className="text-sm text-muted-foreground">
            {t('outOf4', { defaultValue: 'out of 4 hints' })}
          </div>
        </div>
      </Card>
    </div>
  )
}
