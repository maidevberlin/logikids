import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
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
  const hasMoreHints = canRequestHint
  const hintRequestedRef = useRef(false)

  // Auto-show hint after wrong answer (only once per wrong answer)
  useEffect(() => {
    if (hasWrongAnswer && hasMoreHints && requestHint && !hintRequestedRef.current) {
      hintRequestedRef.current = true
      const timer = setTimeout(() => {
        requestHint()
        onHintUsed?.()
      }, 1500)
      return () => clearTimeout(timer)
    }

    // Reset the flag when answer is cleared
    if (!hasWrongAnswer) {
      hintRequestedRef.current = false
    }
  }, [hasWrongAnswer, hasMoreHints, onHintUsed, requestHint])



  const handleRequestHint = () => {
    if (requestHint) {
      requestHint()
      onHintUsed?.()
    }
  }

  // Get the color for the next hint
  const nextHintIndex = hints.length
  const nextHintColorClass = HINT_COLORS[nextHintIndex % HINT_COLORS.length]

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

      {/* Loading skeleton for hint */}
      {hintLoading && (
        <Card className={cn('p-4 border-2 animate-in fade-in', nextHintColorClass)}>
          <div className="flex gap-3">
            <Skeleton className="w-6 h-6 flex-shrink-0 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        </Card>
      )}

      {/* Error message */}
      {hintError && (
        <div className="text-red-600 text-sm text-center">{hintError}</div>
      )}

      {/* Request hint button */}
      {hasMoreHints && !hintLoading && (
        <div className="flex justify-center">
          <Button
            onClick={handleRequestHint}
            variant="outline"
            size="lg"
            className="rounded-xl"
          >
            <Lightbulb className="w-5 h-5 mr-2" />
            {hints.length === 0
              ? t('task.getHint', { defaultValue: 'Get a Hint' })
              : t('task.getAnotherHint', { defaultValue: 'Get Another Hint' })}
          </Button>
        </div>
      )}
    </div>
  )
}
