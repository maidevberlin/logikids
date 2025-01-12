import { ChartBarIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cn } from '../../../utils/cn'
import { StatsButtonProps } from './types'
import { styles } from './styles'

export function StatsButton({ onClick, className }: StatsButtonProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  
  const handleClick = onClick || (() => navigate('/stats'))
  
  return (
    <button
      onClick={handleClick}
      className={cn(styles.base, className)}
      aria-label={t('stats.title')}
    >
      <ChartBarIcon className={styles.icon} />
    </button>
  )
} 