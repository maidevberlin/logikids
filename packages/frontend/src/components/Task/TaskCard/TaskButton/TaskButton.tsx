import { PlayIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cn } from '../../../../utils/cn'
import { TaskButtonProps } from './types'
import { styles } from './styles'

export function TaskButton({ 
  onClick,
  variant = 'primary',
  disabled = false,
  className
}: TaskButtonProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  
  const handleClick = onClick || (() => navigate('/tasks'))
  
  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        styles.base,
        styles.variant[variant],
        disabled && styles.disabled,
        className
      )}
      aria-label={t('task.title')}
    >
      <PlayIcon className={styles.icon} />
    </button>
  )
} 