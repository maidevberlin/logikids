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
import { TIMING } from '../../../constants/timing'

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
  const [shouldGlowHint, setShouldGlowHint] = useState(false)
  const [wrongAnswerCount, setWrongAnswerCount] = useState(0)
  const hasMoreHints = visibleHints < hints.length
  const hasHints = hints.length > 0

  // Track wrong answers
  useEffect(() => {
    if (hasWrongAnswer) {
      setWrongAnswerCount(prev => prev + 1)
    }
  }, [hasWrongAnswer])

  // Auto-show hint after wrong answer
  useEffect(() => {
    if (wrongAnswerCount > 0 && hasMoreHints) {
      // Start glowing immediately when wrong answer is given
      setShouldGlowHint(true)
      
      // Show hint automatically after a short delay
      const showHintTimer = setTimeout(() => {
        setVisibleHints(prev => prev + 1)
        setShouldGlowHint(false)
      }, TIMING.HINT_WRONG_ANSWER_DELAY)

      return () => clearTimeout(showHintTimer)
    }
  }, [wrongAnswerCount, hasMoreHints])

  // Start glowing after period of inactivity
  useEffect(() => {
    if (hasMoreHints && !shouldGlowHint) {
      const glowTimer = setTimeout(() => {
        setShouldGlowHint(true)
      }, TIMING.HINT_GLOW_TIMEOUT)

      return () => clearTimeout(glowTimer)
    }
  }, [hasMoreHints, shouldGlowHint])

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
      
      <div className="flex justify-center">
        <HintButton
          onClick={() => {
            setVisibleHints(prev => prev + 1)
            setShouldGlowHint(false)
          }}
          disabled={!hasMoreHints}
          shouldShake={false}
          shouldGlow={shouldGlowHint && hasMoreHints}
          isFirstHint={visibleHints === 0}
        />
      </div>
    </div>
  )
} 