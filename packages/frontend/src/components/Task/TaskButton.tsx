import { PlayIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { interactive, position } from '../base/styles'
import { cn } from '../base/styles/utils'
import { useTranslation } from 'react-i18next'

export function TaskButton() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  
  return (
    <button
      type="button"
      onClick={() => navigate('/tasks')}
      className={cn(
        position.fixed,
        'top-4 right-20', // Position it to the left of the stats button
        'text-gray-500 hover:text-primary-600',
        interactive.transition,
        'z-10'
      )}
    >
      <span className="sr-only">{t('task.title')}</span>
      <PlayIcon className="h-5 w-5" aria-hidden="true" />
    </button>
  )
} 