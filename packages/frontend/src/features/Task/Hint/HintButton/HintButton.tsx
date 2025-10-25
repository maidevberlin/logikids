import { type ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { LightBulbIcon } from '@heroicons/react/24/outline'
import { cn } from '../../../../utils/cn'
import { styles } from './styles'
import { useShake } from '../../../base/Animations/Shake'
import { useGlow } from '../../../base/Animations/Glow'

interface HintButtonProps {
  onClick: () => void
  disabled: boolean
  shouldGlow: boolean
  isFirstHint: boolean
  isLoading?: boolean
}

export function HintButton({
  onClick,
  disabled,
  shouldGlow,
  isFirstHint,
  isLoading = false
}: HintButtonProps): ReactElement {
  const { t } = useTranslation()
  const [isShaking] = useShake()
  const [isGlowing] = useGlow()

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        styles.base,
        disabled && styles.disabled,
        isShaking && styles.shake,
        isGlowing && styles.glow
      )}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full border-2 border-amber-500 border-t-transparent w-5 h-5" />
      ) : (
        <>
          <LightBulbIcon className={cn(
            styles.icon,
            shouldGlow && styles.glow
          )} />
          <span>
            {isFirstHint ? t('task.getHint') : t('task.getAnotherHint')}
          </span>
        </>
      )}
    </button>
  )
} 
