import { ChartBarIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '../base/Button/Button'

export function StatsButton() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  
  return (
    <Button
      onClick={() => navigate('/stats')}
      variant="default"
      size="sm"
      iconOnly
      className="fixed top-4 right-12 z-10"
      aria-label={t('stats.title')}
    >
      <ChartBarIcon className="h-5 w-5" />
    </Button>
  )
} 