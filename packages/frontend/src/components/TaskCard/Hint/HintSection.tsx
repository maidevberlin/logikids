import { useState, useEffect } from 'react'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { FadeInOut } from '../../base/Animations/FadeInOut'
import { HintBox } from './HintBox'
import { HintButton } from './HintButton'
import { HINT_TIMING } from '../../../constants/timing'
import { flex, text, interactive } from '../../base/styles'
import { cn } from '../../base/styles/utils'

interface HintSectionProps {
  hints: string[]
  onSkip: () => void
}

export function HintSection({ hints, onSkip }: HintSectionProps) {
  const [visibleHints, setVisibleHints] = useState(0)
  const [shouldShake, setShouldShake] = useState(false)
  const hasMoreHints = visibleHints < hints.length
  const hasHints = hints.length > 0

  useEffect(() => {
    const timer = setTimeout(() => {
      if (hasMoreHints) {
        setShouldShake(true)
      }
    }, HINT_TIMING.SHAKE_DELAY)

    return () => clearTimeout(timer)
  }, [hasMoreHints])

  const handleRequestHint = () => {
    if (hasMoreHints) {
      setVisibleHints(prev => prev + 1)
      setShouldShake(false)
    }
  }

  if (!hasHints) {
    return (
      <div className={cn(flex.end)}>
        <button
          onClick={onSkip}
          className={cn(
            flex.center,
            flex.gap.sm,
            text.size.sm,
            text.weight.medium,
            text.color.primary,
            interactive.transition,
            'hover:text-primary-700'
          )}
        >
          Skip
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <FadeInOut 
        show={visibleHints > 0} 
        className="space-y-2"
        duration={HINT_TIMING.FADE_DURATION}
      >
        {hints.slice(0, visibleHints).map((hint, index) => (
          <HintBox key={index} hint={hint} index={index} />
        ))}
      </FadeInOut>
      
      <div className={cn(flex.between, flex.center)}>
        <HintButton
          onClick={handleRequestHint}
          disabled={!hasMoreHints}
          shouldShake={shouldShake}
          isFirstHint={visibleHints === 0}
        />
        <button
          onClick={onSkip}
          className={cn(
            flex.center,
            flex.gap.sm,
            text.size.sm,
            text.weight.medium,
            text.color.primary,
            interactive.transition,
            'hover:text-primary-700'
          )}
        >
          Skip
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
} 