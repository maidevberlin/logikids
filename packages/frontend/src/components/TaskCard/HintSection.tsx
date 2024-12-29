import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { Button } from '../base/Button'
import { FadeInOut } from '../base/Animations/FadeInOut'
import { Card } from '../base/Card'
import { Text } from '../base/Typography/Text'
import { HintButton } from './Hint/HintButton'

interface HintSectionProps {
  hints: string[]
  onSkip: () => void
}

export function HintSection({ hints, onSkip }: HintSectionProps) {
  const { t } = useTranslation()
  const [visibleHints, setVisibleHints] = useState(0)
  const hasMoreHints = visibleHints < hints.length
  const hasHints = hints.length > 0

  useEffect(() => {
    const timer = setTimeout(() => {
      if (hasMoreHints) {
        setVisibleHints(prev => prev + 1)
      }
    }, 30000)

    return () => clearTimeout(timer)
  }, [hasMoreHints])

  if (!hasHints) {
    return (
      <div className="flex justify-end">
        <Button
          onClick={onSkip}
          variant="outline"
          size="sm"
        >
          <span className="inline-flex items-center gap-2">
            {t('task.skip')}
            <ArrowRightIcon className="h-5 w-5" />
          </span>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <FadeInOut show={visibleHints > 0} className="space-y-2">
        {hints.slice(0, visibleHints).map((hint, index) => (
          <Card key={index} variant="primary" className="p-4">
            <Text>{hint}</Text>
          </Card>
        ))}
      </FadeInOut>
      
      <div className="flex justify-between">
        <HintButton
          onClick={() => setVisibleHints(prev => prev + 1)}
          disabled={!hasMoreHints}
          shouldShake={hasMoreHints}
          isFirstHint={visibleHints === 0}
        />
        <Button
          onClick={onSkip}
          variant="outline"
          size="sm"
        >
          <span className="inline-flex items-center gap-2">
            {t('task.skip')}
            <ArrowRightIcon className="h-5 w-5" />
          </span>
        </Button>
      </div>
    </div>
  )
} 