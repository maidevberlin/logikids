import { ChartBarIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { interactive, position } from '../base/styles'
import { cn } from '../base/styles/utils'
import { useTranslation } from 'react-i18next'

export function StatsButton() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  
  return (
    <button
      type="button"
      onClick={() => navigate('/stats')}
      className={cn(
        position.fixed,
        'top-4 right-12', // Position it between task and settings buttons
        'text-gray-500 hover:text-primary-600',
        interactive.transition,
        'z-10'
      )}
    >
      <span className="sr-only">{t('stats.title')}</span>
      <ChartBarIcon className="h-5 w-5" aria-hidden="true" />
    </button>
  )
} 