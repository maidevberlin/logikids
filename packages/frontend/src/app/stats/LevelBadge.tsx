import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/card'

const TASK_LEVELS = [
  { threshold: 5, colorClass: 'bg-blue-300' },
  { threshold: 15, colorClass: 'bg-blue-400' },
  { threshold: 30, colorClass: 'bg-blue-500' },
  { threshold: 50, colorClass: 'bg-blue-600' },
  { threshold: 75, colorClass: 'bg-indigo-300' },
  { threshold: 100, colorClass: 'bg-indigo-400' },
  { threshold: 150, colorClass: 'bg-indigo-500' },
  { threshold: 200, colorClass: 'bg-indigo-600' },
  { threshold: 300, colorClass: 'bg-purple-300' },
  { threshold: 400, colorClass: 'bg-purple-400' },
  { threshold: 550, colorClass: 'bg-purple-500' },
  { threshold: 700, colorClass: 'bg-purple-600' },
  { threshold: 900, colorClass: 'bg-violet-300' },
  { threshold: 1100, colorClass: 'bg-violet-400' },
  { threshold: 1350, colorClass: 'bg-violet-500' },
  { threshold: 1600, colorClass: 'bg-violet-600' },
  { threshold: 2000, colorClass: 'bg-fuchsia-300' },
  { threshold: 2500, colorClass: 'bg-fuchsia-400' },
  { threshold: 3000, colorClass: 'bg-fuchsia-500' },
  { threshold: 4000, colorClass: 'bg-fuchsia-600' },
]

interface LevelBadgeProps {
  totalTasks: number
}

export function LevelBadge({ totalTasks }: LevelBadgeProps) {
  const { t } = useTranslation('stats')

  const currentLevelIndex = TASK_LEVELS.findIndex(level => totalTasks < level.threshold)
  const currentLevel = currentLevelIndex === -1 ? TASK_LEVELS.length : currentLevelIndex
  const previousThreshold = currentLevel > 0 ? TASK_LEVELS[currentLevel - 1].threshold : 0
  const nextThreshold = currentLevel >= TASK_LEVELS.length
    ? TASK_LEVELS[TASK_LEVELS.length - 1].threshold
    : TASK_LEVELS[currentLevel].threshold
  const progress = ((totalTasks - previousThreshold) / (nextThreshold - previousThreshold)) * 100
  const colorClass = TASK_LEVELS[Math.min(currentLevel, TASK_LEVELS.length - 1)].colorClass

  return (
    <Card className="p-8 bg-card shadow-md rounded-2xl flex flex-col items-center space-y-4">
      {/* Circular badge with progress ring */}
      <div className="relative w-40 h-40">
        {/* Progress ring */}
        <svg className="w-40 h-40 transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-muted"
          />
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 70}`}
            strokeDashoffset={`${2 * Math.PI * 70 * (1 - progress / 100)}`}
            className={`transition-all duration-1000 ${colorClass.replace('bg-', 'text-')}`}
            strokeLinecap="round"
          />
        </svg>

        {/* Level number in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Level
            </div>
            <div className={`text-5xl font-bold ${colorClass.replace('bg-', 'text-')}`}>
              {currentLevel + 1}
            </div>
          </div>
        </div>
      </div>

      {/* XP progress text */}
      <div className="text-center">
        <div className="text-lg font-medium text-foreground">
          {totalTasks} / {nextThreshold} {t('tasks', { defaultValue: 'tasks' })}
        </div>
      </div>
    </Card>
  )
}
