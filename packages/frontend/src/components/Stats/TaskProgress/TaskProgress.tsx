import { cn } from '../../../utils/cn'
import { TASK_LEVELS, TaskProgressProps } from './types'
import { styles } from './styles'
import { Text } from '../../base/Typography'

export function TaskProgress({ value }: TaskProgressProps) {
  const currentLevel = TASK_LEVELS.findIndex(level => value < level.threshold) 
  const previousThreshold = currentLevel > 0 ? TASK_LEVELS[currentLevel - 1].threshold : 0
  const nextThreshold = currentLevel >= 0 ? TASK_LEVELS[currentLevel].threshold : TASK_LEVELS[0].threshold
  const progress = ((value - previousThreshold) / (nextThreshold - previousThreshold)) * 100

  return (
    <div className={styles.base}>
      <Text size="lg" className={styles.title}>
        Total Tasks
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
              TASK_LEVELS[currentLevel >= 0 ? currentLevel : 0].colorClass
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