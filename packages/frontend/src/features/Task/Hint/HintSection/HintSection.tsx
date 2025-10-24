import { useState, useEffect } from 'react'
import DOMPurify from 'dompurify'
import { FadeInOut } from '../../../base/Animations/FadeInOut'
import { HintButton } from '../HintButton'
import { 
  LightBulbIcon, 
  InformationCircleIcon,
  PuzzlePieceIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline'
import { cn } from '../../../../utils/cn'
import { styles } from './styles'
import { GLOW_TIMING } from '../../../base/Animations/Glow/constants'
import { HINT_TIMING } from './constants'

interface HintSectionProps {
  hints: string[]
  hasWrongAnswer?: boolean
  onHintUsed?: () => void
  requestHint?: () => void
  hintLoading?: boolean
  hintError?: string | null
  canRequestHint?: boolean
}

const HINT_ICONS = [
  { icon: LightBulbIcon },
  { icon: InformationCircleIcon },
  { icon: PuzzlePieceIcon },
  { icon: CheckCircleIcon }
]

export function HintSection({
  hints,
  hasWrongAnswer = false,
  onHintUsed,
  requestHint,
  hintLoading = false,
  hintError = null,
  canRequestHint = true
}: HintSectionProps) {
  const [shouldGlowHint, setShouldGlowHint] = useState(false)
  const [wrongAnswerCount, setWrongAnswerCount] = useState(0)
  const hasMoreHints = canRequestHint
  const hasHints = hints.length > 0 || hasMoreHints

  // Track wrong answers
  useEffect(() => {
    if (hasWrongAnswer) {
      setWrongAnswerCount(prev => prev + 1)
    }
  }, [hasWrongAnswer])

  // Auto-show hint after wrong answer
  useEffect(() => {
    if (wrongAnswerCount > 0 && hasMoreHints && requestHint) {
      // Start glowing immediately when wrong answer is given
      setShouldGlowHint(true)

      // Request hint automatically after a short delay
      const showHintTimer = setTimeout(() => {
        requestHint()
        setShouldGlowHint(false)
        onHintUsed?.()
      }, HINT_TIMING.delay)

      return () => clearTimeout(showHintTimer)
    }
  }, [wrongAnswerCount, hasMoreHints, onHintUsed, requestHint])

  // Start glowing after period of inactivity
  useEffect(() => {
    if (hasMoreHints && !shouldGlowHint) {
      const glowTimer = setTimeout(() => {
        setShouldGlowHint(true)
      }, GLOW_TIMING.duration)

      return () => clearTimeout(glowTimer)
    }
  }, [hasMoreHints, shouldGlowHint])

  if (!hasHints) {
    return null
  }

  const handleRequestHint = () => {
    if (requestHint) {
      requestHint()
      setShouldGlowHint(false)
      onHintUsed?.()
    }
  }

  return (
    <div className={styles.base}>
      <FadeInOut show={hints.length > 0} className={styles.list}>
        {hints.map((hint, index) => {
          const { icon: IconComponent } = HINT_ICONS[index] || HINT_ICONS[0]
          const variant = ((index % 4) + 1) as 1 | 2 | 3 | 4
          return (
            <div key={index} className={cn(styles.item.base, styles.variants[variant].base)}>
              <div className={styles.item.content}>
                <div className={styles.item.icon}>
                  <IconComponent className={styles.variants[variant].icon} />
                </div>
                <div
                  className={cn(styles.item.text, styles.variants[variant].text)}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(hint)
                  }}
                />
              </div>
            </div>
          )
        })}
      </FadeInOut>

      {hintError && (
        <div className="text-red-500 text-sm text-center mb-2">
          {hintError}
        </div>
      )}

      <div className="flex justify-center">
        <HintButton
          onClick={handleRequestHint}
          disabled={!hasMoreHints || hintLoading}
          shouldGlow={shouldGlowHint && hasMoreHints}
          isFirstHint={hints.length === 0}
        />
        {hintLoading && (
          <div className="ml-2 text-sm text-gray-500 flex items-center">
            Loading hint...
          </div>
        )}
      </div>
    </div>
  )
} 