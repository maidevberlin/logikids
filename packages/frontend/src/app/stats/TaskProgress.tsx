import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'

interface TaskLevel {
  threshold: number
  colorClass: string
}

const TASK_LEVELS: TaskLevel[] = [
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

export interface TaskProgressProps {
  value: number
}

export function TaskProgress({ value }: TaskProgressProps) {
  const { t } = useTranslation('stats')

  const currentLevelIndex = TASK_LEVELS.findIndex(level => value < level.threshold)
  const currentLevel = currentLevelIndex === -1 ? TASK_LEVELS.length : currentLevelIndex
  const previousThreshold = currentLevel > 0 ? TASK_LEVELS[currentLevel - 1].threshold : 0
  const nextThreshold = currentLevel >= TASK_LEVELS.length
    ? TASK_LEVELS[TASK_LEVELS.length - 1].threshold
    : TASK_LEVELS[currentLevel].threshold
  const progress = ((value - previousThreshold) / (nextThreshold - previousThreshold)) * 100
  const colorClass = TASK_LEVELS[Math.min(currentLevel, TASK_LEVELS.length - 1)].colorClass

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-foreground">
          {t('totalTasks', { defaultValue: 'Total Tasks Completed' })}
        </h3>
        <Badge variant="secondary" className="text-base px-4 py-1">
          Level {currentLevel + 1}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{value} {t('tasks', { defaultValue: 'tasks' })}</span>
          <span>{nextThreshold} {t('tasks', { defaultValue: 'tasks' })}</span>
        </div>

        <div className="h-4 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${colorClass}`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{previousThreshold}</span>
          <span>{nextThreshold}</span>
        </div>
      </div>
    </div>
  )
}
