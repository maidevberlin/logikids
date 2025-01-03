import { PlayIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cn } from '../../../../utils/cn'
import { TaskButtonProps } from './types'
import { styles } from './styles'

export function TaskButton({ 
  onClick,
  className
}: TaskButtonProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      navigate('/task')
    }
  }

  return (
    <button
      onClick={handleClick}
      className={cn(styles.base, className)}
      aria-label={t('task.title')}
    >
      <PlayIcon className={styles.icon} />
    </button>
  )
} 