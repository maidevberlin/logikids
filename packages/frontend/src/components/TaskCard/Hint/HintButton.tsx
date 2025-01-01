import { useTranslation } from 'react-i18next'
import { LightBulbIcon } from '@heroicons/react/24/outline'
import { Button } from '../../base/Button/Button'
import { cn } from '../../base/styles/utils'
import { useShakeAnimation, useGlowAnimation } from '../../../hooks/useAnimation'

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
  const { t } = useTranslation()
  const [isShaking] = useShakeAnimation()
  const [isGlowing] = useGlowAnimation()

  const glowClasses = shouldGlow ? [
    'text-yellow-500',
    'animate-hint-glow'
  ] : []

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant="primary"
      className={cn(
        isShaking && 'animate-shake',
        isGlowing && 'animate-hint-glow'
      )}
    >
      <span className={cn(
        'inline-flex items-center gap-2',
        ...glowClasses
      )}>
        <LightBulbIcon className={cn(
          'h-5 w-5',
          ...glowClasses
        )} />
        {isFirstHint ? t('task.getHint') : t('task.getAnotherHint')}
      </span>
    </Button>
  )
} 