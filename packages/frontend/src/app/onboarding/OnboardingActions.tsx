import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/app/common/ui/button'

interface OnboardingActionsProps {
  onContinue: () => void
  onBack?: () => void
  continueLabel: string
  continueDisabled?: boolean
  continueIcon?: boolean
  footer?: React.ReactNode
}

/**
 * Shared component for onboarding step actions
 * - Primary continue button centered
 * - Optional back link below (text with chevron)
 * - Optional footer content (e.g., Privacy/Terms links)
 */
export function OnboardingActions({
  onContinue,
  onBack,
  continueLabel,
  continueDisabled = false,
  continueIcon = true,
  footer,
}: OnboardingActionsProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      {/* Footer content (e.g., Privacy/Terms) */}
      {footer && <div className="mb-6">{footer}</div>}

      {/* Primary action button - centered */}
      <div className="flex flex-col items-center gap-4">
        <Button
          onClick={onContinue}
          disabled={continueDisabled}
          size="lg"
          className="w-full max-w-xs"
        >
          {continueLabel}
          {continueIcon && <ChevronRight className="ml-2 w-5 h-5" />}
        </Button>

        {/* Back link - subtle text below */}
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            {t('common.back', { defaultValue: 'Back' })}
          </button>
        )}
      </div>
    </div>
  )
}
