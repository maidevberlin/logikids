import { useTranslation } from 'react-i18next'
import { LightBulbIcon } from '@heroicons/react/24/outline'
import { Button } from '../../base/Button/Button'
import { Shake } from '../../base/Animations'
import { flex } from '../../base/styles'
import { cn } from '../../base/styles/utils'

interface HintButtonProps {
  onClick: () => void
  disabled: boolean
  shouldShake: boolean
  shouldGlow: boolean
  isFirstHint: boolean
}

export function HintButton({ 
  onClick, 
  disabled,
  shouldShake,
  shouldGlow,
  isFirstHint
}: HintButtonProps) {
  const { t } = useTranslation('common')

  const glowClasses = shouldGlow ? [
    'text-yellow-500',
    'animate-hint-glow'
  ] : []

  return (
    <Shake shouldShake={shouldShake}>
      <Button
        onClick={onClick}
        disabled={disabled}
        variant="primary"
      >
        <span className={cn(
          flex.center,
          flex.gap.sm,
          ...glowClasses
        )}>
          <LightBulbIcon className={cn(
            "h-5 w-5",
            ...glowClasses
          )} />
          {isFirstHint ? t('task.getHint') : t('task.getAnotherHint')}
        </span>
      </Button>
    </Shake>
  )
} 