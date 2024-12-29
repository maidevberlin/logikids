import { LightBulbIcon } from '@heroicons/react/24/outline'
import { Button } from '../../base/Button'
import { Shake } from '../../base/Animations'
import { flex } from '../../base/styles'
import { cn } from '../../base/styles/utils'

interface HintButtonProps {
  onClick: () => void
  disabled: boolean
  shouldShake: boolean
  isFirstHint: boolean
}

export function HintButton({ 
  onClick, 
  disabled,
  shouldShake,
  isFirstHint
}: HintButtonProps) {
  return (
    <Shake shouldShake={shouldShake}>
      <Button
        onClick={onClick}
        disabled={disabled}
        variant="primary"
      >
        <span className={cn(
          flex.center,
          flex.gap.sm
        )}>
          <LightBulbIcon className="h-5 w-5" />
          {isFirstHint ? 'Get Hint' : 'Get Another Hint'}
        </span>
      </Button>
    </Shake>
  )
} 