import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { Lightbulb, Info, CircleDot, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HintSectionProps {
  hints: string[]
  hasWrongAnswer?: boolean
  onHintUsed?: () => void
  requestHint?: () => void
  hintLoading?: boolean
  hintError?: string | null
  canRequestHint?: boolean
}

const HINT_ICONS = [Lightbulb, Info, CircleDot, CheckCircle]

const HINT_COLORS = [
  'border-blue-200 bg-blue-50 text-blue-900',
  'border-purple-200 bg-purple-50 text-purple-900',
  'border-emerald-200 bg-emerald-50 text-emerald-900',
  'border-amber-200 bg-amber-50 text-amber-900',
]

export function HintSection({
  hints,
  hasWrongAnswer = false,
  onHintUsed,
  requestHint,
  hintLoading = false,
  hintError = null,
  canRequestHint = true,
}: HintSectionProps) {
  const { t } = useTranslation()
  const [wrongAnswerCount, setWrongAnswerCount] = useState(0)
  const hasMoreHints = canRequestHint
  const hasHints = hints.length > 0 || hasMoreHints

  // Track wrong answers
  useEffect(() => {
    if (hasWrongAnswer) {
      setWrongAnswerCount((prev) => prev + 1)
    }
  }, [hasWrongAnswer])

  // Auto-show hint after wrong answer
  useEffect(() => {
    if (wrongAnswerCount > 0 && hasMoreHints && requestHint) {
      const timer = setTimeout(() => {
        requestHint()
        onHintUsed?.()
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [wrongAnswerCount, hasMoreHints, onHintUsed, requestHint])

  if (!hasHints) {
    return null
  }

  const handleRequestHint = () => {
    if (requestHint) {
      requestHint()
      onHintUsed?.()
    }
  }

  return (
    <div className="space-y-4 mt-6">
      {/* Display hints */}
      {hints.map((hint, index) => {
        const Icon = HINT_ICONS[index % HINT_ICONS.length]
        const colorClass = HINT_COLORS[index % HINT_COLORS.length]

        return (
          <Card
            key={index}
            className={cn('p-4 border-2 animate-in fade-in slide-in-from-top-4', colorClass)}
          >
            <div className="flex gap-3">
              <Icon className="w-6 h-6 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <MarkdownRenderer
                  content={hint}
                  enableMath={true}
                  enableMermaid={false}
                  enableCode={false}
                />
              </div>
            </div>
          </Card>
        )
      })}

      {/* Error message */}
      {hintError && (
        <div className="text-red-600 text-sm text-center">{hintError}</div>
      )}

      {/* Request hint button */}
      {hasMoreHints && (
        <div className="flex justify-center">
          <Button
            onClick={handleRequestHint}
            disabled={!hasMoreHints || hintLoading}
            variant="outline"
            size="lg"
            className="rounded-xl"
          >
            <Lightbulb className="w-5 h-5 mr-2" />
            {hintLoading
              ? t('hint.loading', { defaultValue: 'Loading hint...' })
              : hints.length === 0
              ? t('hint.getHint', { defaultValue: 'Get a Hint' })
              : t('hint.getAnother', { defaultValue: 'Get Another Hint' })}
          </Button>
        </div>
      )}
    </div>
  )
}
