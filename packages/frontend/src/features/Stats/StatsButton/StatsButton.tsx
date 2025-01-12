import { useTranslation } from 'react-i18next'
import { Button } from '../../base/Button'
import { StatsButtonProps } from './types'
import { useNavigate } from 'react-router-dom'
import { useProgress } from '../useProgress'
import { TASK_LEVELS } from '../TaskProgress/types'
import { cn } from '../../../utils/cn'
import { styles } from './styles'

function LevelIndicator() {
  const { getTotalTasksOverall } = useProgress()
  const value = getTotalTasksOverall()
  const currentLevelIndex = TASK_LEVELS.findIndex(level => value < level.threshold)
  const currentLevel = currentLevelIndex === -1 ? TASK_LEVELS.length : currentLevelIndex
  const previousThreshold = currentLevel > 0 ? TASK_LEVELS[currentLevel - 1].threshold : 0
  const nextThreshold = currentLevel >= TASK_LEVELS.length 
    ? TASK_LEVELS[TASK_LEVELS.length - 1].threshold 
    : TASK_LEVELS[currentLevel].threshold
  const progress = ((value - previousThreshold) / (nextThreshold - previousThreshold)) * 100

  return (
    <div className={styles.level.base}>
      <div className={styles.level.text}>
        {currentLevel + 1}
      </div>
      <div className={styles.level.progress}>
        <div 
          className={cn(
            styles.level.bar,
            TASK_LEVELS[Math.min(currentLevel, TASK_LEVELS.length - 1)].colorClass
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

export function StatsButton({ className }: StatsButtonProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <Button 
      variant="default"
      className={cn(styles.button, className)} 
      onClick={() => navigate('/stats')}
      aria-label={t('stats.title')}
    >
      <LevelIndicator />
    </Button>
  )
} 