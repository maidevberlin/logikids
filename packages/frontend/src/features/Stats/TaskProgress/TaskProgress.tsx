import { cn } from '../../../utils/cn'
import { TASK_LEVELS, TaskProgressProps } from './types'
import { styles } from './styles'
import { Text } from '../../base/Typography'
import { useTranslation } from 'react-i18next'

export function TaskProgress({ value }: TaskProgressProps) {
  const { t } = useTranslation()
  const currentLevelIndex = TASK_LEVELS.findIndex(level => value < level.threshold)
  const currentLevel = currentLevelIndex === -1 ? TASK_LEVELS.length : currentLevelIndex
  const previousThreshold = currentLevel > 0 ? TASK_LEVELS[currentLevel - 1].threshold : 0
  const nextThreshold = currentLevel >= TASK_LEVELS.length 
    ? TASK_LEVELS[TASK_LEVELS.length - 1].threshold 
    : TASK_LEVELS[currentLevel].threshold
  const progress = ((value - previousThreshold) / (nextThreshold - previousThreshold)) * 100

  return (
    <div className={styles.base}>
      <Text size="lg" className={styles.title}>
        {t('stats.totalTasks')}
      </Text>
      <div className={styles.content}>
        <div className={styles.header}>
          <Text size="lg" className={styles.level}>
            Level {currentLevel + 1}
          </Text>
          <Text size="lg" className={styles.count}>
            {value} / {nextThreshold} tasks
          </Text>
        </div>
        <div className={styles.bar.base}>
          <div 
            className={cn(
              styles.bar.fill,
              TASK_LEVELS[Math.min(currentLevel, TASK_LEVELS.length - 1)].colorClass
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className={styles.scale}>
          <span>{previousThreshold}</span>
          <span>{nextThreshold}</span>
        </div>
      </div>
    </div>
  )
} 