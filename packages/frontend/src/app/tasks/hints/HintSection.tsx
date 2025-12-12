import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/app/common/ui/card'
import { Button } from '@/app/common/ui/button'
import { Skeleton } from '@/app/common/ui/skeleton'
import { MarkdownRenderer } from '@/app/common/MarkdownRenderer'
import { PlayButton } from '@/app/common/PlayButton'
import { Lightbulb, Info, CircleDot, CheckCircle } from 'lucide-react'
import { cn } from '@/app/common/cn'

interface HintSectionProps {
  taskId: string
  hints: string[]
  hasWrongAnswer?: boolean
  requestHint?: () => void
  hintLoading?: boolean
  hintError?: string | null
  canRequestHint?: boolean
}

const HINT_ICONS = [Lightbulb, Info, CircleDot, CheckCircle]

// Hint colors are distinct from answer option colors (blue, purple, emerald, pink, orange, teal, indigo)
const HINT_COLORS = [
  'border-amber-200 bg-amber-50 text-amber-900',
  'border-cyan-200 bg-cyan-50 text-cyan-900',
  'border-rose-200 bg-rose-50 text-rose-900',
  'border-lime-200 bg-lime-50 text-lime-900',
]

const HINT_BUTTON_COLORS = [
  'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100 hover:border-amber-400',
  'bg-cyan-50 border-cyan-300 text-cyan-700 hover:bg-cyan-100 hover:border-cyan-400',
  'bg-rose-50 border-rose-300 text-rose-700 hover:bg-rose-100 hover:border-rose-400',
  'bg-lime-50 border-lime-300 text-lime-700 hover:bg-lime-100 hover:border-lime-400',
]

export function HintSection({
  taskId,
  hints,
  hasWrongAnswer = false,
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
      }, 1500)
      return () => clearTimeout(timer)
    }

    // Reset the flag when answer is cleared
    if (!hasWrongAnswer) {
      hintRequestedRef.current = false
    }
  }, [hasWrongAnswer, hasMoreHints, requestHint])

  const handleRequestHint = () => {
    if (requestHint) {
      requestHint()
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
              <PlayButton taskId={taskId} field={`hint:${index}`} />
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
      {hintError && <div className="text-red-600 text-sm text-center">{hintError}</div>}

      {/* Request hint button */}
      {hasMoreHints && !hintLoading && (
        <div className="flex justify-center">
          <Button
            onClick={handleRequestHint}
            variant="outline"
            size="lg"
            className={cn(
              'rounded-xl border-2 hover:scale-105 hover:-rotate-1 transition-all duration-200 shadow-sm hover:shadow-md',
              HINT_BUTTON_COLORS[nextHintIndex % HINT_BUTTON_COLORS.length]
            )}
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
