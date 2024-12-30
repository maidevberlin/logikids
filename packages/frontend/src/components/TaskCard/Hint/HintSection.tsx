import { useState, useEffect } from 'react'
import DOMPurify from 'dompurify'
import { FadeInOut } from '../../base/Animations/FadeInOut'
import { Card } from '../../base/Card'
import { HintButton } from './HintButton'
import { 
  LightBulbIcon, 
  InformationCircleIcon,
  PuzzlePieceIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline'

interface HintSectionProps {
  hints: string[]
  hasWrongAnswer?: boolean
}

const HINT_ICONS = [
  { 
    icon: LightBulbIcon, 
    title: 'Context Hint', 
    bgColor: 'bg-gray-50/50',
    iconColor: 'text-gray-500'
  },
  { 
    icon: InformationCircleIcon, 
    title: 'Information Hint', 
    bgColor: 'bg-gray-50/50',
    iconColor: 'text-blue-500'
  },
  { 
    icon: PuzzlePieceIcon, 
    title: 'Solution Approach', 
    bgColor: 'bg-gray-50/50',
    iconColor: 'text-cyan-500'
  },
  { 
    icon: CheckCircleIcon, 
    title: 'Complete Solution', 
    bgColor: 'bg-gray-50/50',
    iconColor: 'text-green-500'
  }
]

export function HintSection({ hints, hasWrongAnswer = false }: HintSectionProps) {
  const [visibleHints, setVisibleHints] = useState(0)
  const [shouldShakeHint, setShouldShakeHint] = useState(false)
  const hasMoreHints = visibleHints < hints.length
  const hasHints = hints.length > 0

  // Show next hint on wrong answer
  useEffect(() => {
    if (hasWrongAnswer && hasMoreHints) {
      setVisibleHints(prev => prev + 1)
      setShouldShakeHint(false)
    }
  }, [hasWrongAnswer, hasMoreHints])

  // Timer effect for auto-showing hints
  useEffect(() => {
    // Reset shake state when visible hints change
    setShouldShakeHint(false)

    const shakeTimer = setTimeout(() => {
      if (hasMoreHints) {
        setShouldShakeHint(true)
      }
    }, 60000) // 1 minute

    const showHintTimer = setTimeout(() => {
      if (hasMoreHints) {
        setVisibleHints(prev => prev + 1)
        setShouldShakeHint(false)
      }
    }, 90000) // 1.5 minutes

    return () => {
      clearTimeout(shakeTimer)
      clearTimeout(showHintTimer)
    }
  }, [hasMoreHints, visibleHints])

  if (!hasHints) {
    return null
  }

  return (
    <div className="space-y-4">
      <FadeInOut show={visibleHints > 0} className="space-y-2">
        {hints.slice(0, visibleHints).map((hint, index) => {
          const { icon: IconComponent, title, bgColor, iconColor } = HINT_ICONS[index] || HINT_ICONS[0]
          return (
            <Card key={index} variant="primary" className={`p-4 ${bgColor}`}>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <IconComponent className={`w-8 h-8 ${iconColor}`} title={title} />
                </div>
                <div
                  className="flex-grow"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(hint)
                  }}
                />
              </div>
            </Card>
          )
        })}
      </FadeInOut>
      
      <div className="flex justify-start">
        <HintButton
          onClick={() => {
            setVisibleHints(prev => prev + 1)
            setShouldShakeHint(false)
          }}
          disabled={!hasMoreHints}
          shouldShake={shouldShakeHint && hasMoreHints}
          isFirstHint={visibleHints === 0}
        />
      </div>
    </div>
  )
} 