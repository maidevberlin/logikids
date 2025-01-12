import { UserCircleIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cn } from '../../../../utils/cn'
import { SettingsButtonProps } from './types'
import { styles } from './styles'

export function SettingsButton({ onClick, className }: SettingsButtonProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  
  const handleClick = onClick || (() => navigate('/account'))
  
  return (
    <button
      onClick={handleClick}
      className={cn(styles.base, className)}
      aria-label={t('account.title')}
    >
      <UserCircleIcon className={styles.icon} />
    </button>
  )
} 