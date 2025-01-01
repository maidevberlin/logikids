import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '../base/Button/Button'

export function SettingsButton() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  
  return (
    <Button
      onClick={() => navigate('/account')}
      variant="default"
      size="sm"
      iconOnly
      className="fixed top-4 right-4 z-10"
      aria-label={t('account.title')}
    >
      <Cog6ToothIcon className="h-5 w-5" />
    </Button>
  )
} 