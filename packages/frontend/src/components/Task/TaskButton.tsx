import { PlayIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '../base/Button/Button'

export function TaskButton() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  
  return (
    <Button
      onClick={() => navigate('/tasks')}
      variant="default"
      size="sm"
      iconOnly
      className="fixed top-4 right-20 z-10"
      aria-label={t('task.title')}
    >
      <PlayIcon className="h-5 w-5" />
    </Button>
  )
} 