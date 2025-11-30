import { useTranslation } from 'react-i18next'
import { Button } from '@/app/common/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface ShowAllConceptsButtonProps {
  showAll: boolean
  onToggle: () => void
}

export function ShowAllConceptsButton({ showAll, onToggle }: ShowAllConceptsButtonProps) {
  const { t } = useTranslation()

  return (
    <div className="flex justify-center mt-6">
      <Button variant="outline" size="lg" onClick={onToggle} className="gap-2">
        {showAll
          ? t('concepts.hideAdvanced', { defaultValue: 'Show Grade-Appropriate Only' })
          : t('concepts.showAdvanced', { defaultValue: 'Show All Concepts' })}
        {showAll ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </Button>
    </div>
  )
}
