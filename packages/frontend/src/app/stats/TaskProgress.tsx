import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { TASK_LEVELS } from './levels'

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
