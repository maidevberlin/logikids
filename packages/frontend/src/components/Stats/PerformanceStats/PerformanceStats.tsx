import { Text } from '../../base/Typography'
import { ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts'
import { cn } from '../../../utils/cn'
import { GaugeMeterProps, HintUsageBarProps, PerformanceStatsProps } from './types'
import { styles } from './styles'

const GaugeMeter = ({ value }: GaugeMeterProps) => {
  const data = [{ value: 100 }]
  const boundedValue = Math.min(Math.max(value, 0), 100)
  const angle = -90 + (boundedValue * 180 / 100)
  
  return (
    <div className={styles.gaugeMeter.base}>
      <div className={styles.gaugeMeter.container}>
        <ResponsiveContainer width="100%" height={192}>
          <RadialBarChart 
            innerRadius={60}
            outerRadius={80}
            data={data} 
            startAngle={180} 
            endAngle={0}
            barSize={20}
          >
            <defs>
              <linearGradient id="successGradient" x1="1" y1="0" x2="0" y2="0">
                <stop offset="0%" className="text-success-500" stopColor="currentColor" />
                <stop offset="50%" className="text-warning-500" stopColor="currentColor" />
                <stop offset="100%" className="text-error-500" stopColor="currentColor" />
              </linearGradient>
            </defs>
            <RadialBar
              dataKey="value"
              fill="url(#successGradient)"
              background={{ fill: '#E5E7EB' }}
            />
            <g transform={`translate(100, 100) rotate(${angle})`}>
              <path
                d="M0,-40 L5,0 L-5,0 Z"
                className={styles.gaugeMeter.needle}
              />
              <circle r="6" className={styles.gaugeMeter.needle} />
            </g>
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.gaugeMeter.scale}>
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </div>
  )
}

const HintUsageBar = ({ value }: HintUsageBarProps) => {
  const MAX_HINTS = 4
  const percentage = (value / MAX_HINTS) * 100
  
  return (
    <div className={styles.hintUsage.base}>
      <div className={styles.hintUsage.value}>
        {value.toFixed(1)}
        <span className={styles.hintUsage.max}> / {MAX_HINTS}</span>
      </div>
      
      <div className={styles.hintUsage.progress}>
        <div className={styles.hintUsage.track}>
          <div 
            className={cn(
              styles.hintUsage.barFill.base,
              percentage <= 25 && styles.hintUsage.barFill.success,
              percentage <= 50 && styles.hintUsage.barFill.warning,
              percentage <= 75 && styles.hintUsage.barFill.orange,
              percentage > 75 && styles.hintUsage.barFill.error
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className={styles.hintUsage.scale.base}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className={styles.hintUsage.scale.mark}>
              <span className={styles.hintUsage.scale.line} />
              <span>{i}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function PerformanceStats({ successRate, averageHints }: PerformanceStatsProps) {
  return (
    <div className={styles.base}>
      <div className={cn(styles.card.base, styles.card.success)}>
        <Text size="lg" className={cn(styles.title.base, styles.title.success)}>
          Success Rate
        </Text>
        <GaugeMeter value={successRate} />
        <Text size="lg" className={styles.value}>
          {successRate.toFixed(1)}%
        </Text>
      </div>

      <div className={cn(styles.card.base, styles.card.hints)}>
        <Text size="lg" className={cn(styles.title.base, styles.title.hints)}>
          Average Hints
        </Text>
        <HintUsageBar value={averageHints} />
        <Text size="lg" className={styles.value}>
          {averageHints.toFixed(1)} hints
        </Text>
      </div>
    </div>
  )
} 