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
  onHintUsed 
}: HintSectionProps) {
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
        onHintUsed?.()
      }, HINT_TIMING.delay)

      return () => clearTimeout(showHintTimer)
    }
  }, [wrongAnswerCount, hasMoreHints, onHintUsed])

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

  return (
    <div className={styles.base}>
      <FadeInOut show={visibleHints > 0} className={styles.list}>
        {hints.slice(0, visibleHints).map((hint, index) => {
          const { icon: IconComponent } = HINT_ICONS[index] || HINT_ICONS[0]
          const variant = (index + 1) as 1 | 2 | 3
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
      
      <div className="flex justify-center">
        <HintButton
          onClick={() => {
            setVisibleHints(prev => prev + 1)
            setShouldGlowHint(false)
            onHintUsed?.()
          }}
          disabled={!hasMoreHints}
          shouldGlow={shouldGlowHint && hasMoreHints}
          isFirstHint={visibleHints === 0}
        />
      </div>
    </div>
  )
} 