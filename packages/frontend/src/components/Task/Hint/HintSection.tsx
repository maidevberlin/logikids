import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FadeInOut } from '../../base/Animations'
import { Button } from '../../base/Button'
import { Card } from '../../base/Card'
import { cn } from '../../../utils/cn'
import { styles } from './styles'

interface HintSectionProps {
  hints: string[]
  hasWrongAnswer: boolean
  onHintUsed: (index: number) => void
}

export function HintSection({ hints, hasWrongAnswer, onHintUsed }: HintSectionProps) {
  const { t } = useTranslation()
  const [currentHintIndex, setCurrentHintIndex] = useState<number | null>(null)

  const showNextHint = () => {
    const nextIndex = currentHintIndex === null ? 0 : currentHintIndex + 1
    if (nextIndex < hints.length) {
      setCurrentHintIndex(nextIndex)
      onHintUsed(nextIndex)
    }
  }

  if (!hints.length) return null

  return (
    <div className={styles.base}>
      <FadeInOut show={hasWrongAnswer}>
        <Card variant="warning" className={styles.card}>
          <div className={styles.content}>
            {currentHintIndex !== null && (
              <div 
                className={styles.hint}
                dangerouslySetInnerHTML={{ __html: hints[currentHintIndex] }}
              />
            )}
            {currentHintIndex === null || currentHintIndex < hints.length - 1 ? (
              <Button
                variant="warning"
                onClick={showNextHint}
                className={cn(
                  styles.button,
                  currentHintIndex === null && styles.initial
                )}
              >
                {t(currentHintIndex === null ? 'hint.show' : 'hint.next')}
              </Button>
            ) : null}
          </div>
        </Card>
      </FadeInOut>
    </div>
  )
} 