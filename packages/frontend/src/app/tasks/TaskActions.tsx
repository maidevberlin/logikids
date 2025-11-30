import { useTranslation } from 'react-i18next'
import { Button } from '@/app/common/ui/button'
import { HintSection } from './HintSection'
import { CheckCircle, ArrowRight, RotateCcw, SkipForward } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TaskActionsProps {
  isLoading: boolean
  isCorrect: boolean | null
  selectedAnswer: number | boolean | string[] | number[] | { value: number | null; unit?: string } | null
  onAnswerSubmit: () => void
  onAnswerSelect: (answer: number | boolean | string[] | number[] | { value: number | null; unit?: string } | null) => void
  onNextTask: () => void
  hints: string[]
  requestHint: () => void
  hintLoading: boolean
  hintError: string | null
  canRequestHint: boolean
}

export function TaskActions({
  isLoading,
  isCorrect,
  selectedAnswer,
  onAnswerSubmit,
  onAnswerSelect,
  onNextTask,
  hints,
  requestHint,
  hintLoading,
  hintError,
  canRequestHint,
}: TaskActionsProps) {
  const { t } = useTranslation()

  return (
    <>
      {/* Action buttons */}
      {!isLoading && (
        <div className="flex gap-3 justify-center mt-4 sm:mt-6">
          {isCorrect === null ? (
            <Button
              onClick={selectedAnswer === null ? undefined : onAnswerSubmit}
              size="lg"
              className={cn(
                'rounded-xl',
                selectedAnswer === null
                  ? 'opacity-60 cursor-not-allowed'
                  : 'animate-pulse hover:scale-105'
              )}
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              {t('task.checkAnswer', { defaultValue: 'Check Answer' })}
            </Button>
          ) : isCorrect ? (
            <Button onClick={onNextTask} size="lg" className="rounded-xl bg-green-600 hover:bg-green-700">
              {t('task.nextTask', { defaultValue: 'Next Task' })}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={() => onAnswerSelect(null)}
              size="lg"
              variant="outline"
              className="rounded-xl"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              {t('task.tryAgain', { defaultValue: 'Try Again' })}
            </Button>
          )}
        </div>
      )}

      {/* Hints section - only show when not correct */}
      {!isLoading && isCorrect !== true && (
        <>
          <HintSection
            hints={hints}
            hasWrongAnswer={isCorrect === false}
            requestHint={requestHint}
            hintLoading={hintLoading}
            hintError={hintError}
            canRequestHint={canRequestHint}
          />

          {/* Skip link */}
          <div className="mt-4 text-center">
            <Button
              onClick={onNextTask}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <SkipForward className="w-4 h-4 mr-1" />
              {t('task.skip', { defaultValue: 'Skip this task' })}
            </Button>
          </div>
        </>
      )}
    </>
  )
}
