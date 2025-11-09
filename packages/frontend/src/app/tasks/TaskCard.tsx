import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { answerTypeComponents } from './answer-types'
import { HintSection } from './HintSection'
import { DifficultySelector } from './DifficultySelector'
import { CheckCircle, ArrowRight, RotateCcw, SkipForward } from 'lucide-react'
import { Task, SingleChoiceTask, YesNoTask, NumberInputTask, MultiSelectTask, OrderingTask, FillInBlankTask } from './types'
import { NumberInputGradingDetails } from './useTaskAnswer'
import { cn } from '@/lib/utils'

interface TaskCardProps {
  task: Task | null
  isLoading: boolean
  error: string | null
  selectedAnswer: number | boolean | string[] | number[] | { value: number | null; unit?: string } | null
  isCorrect: boolean | null
  gradingDetails: NumberInputGradingDetails | null
  onAnswerSelect: (answer: number | boolean | string[] | number[] | { value: number | null; unit?: string } | null) => void
  onAnswerSubmit: () => void
  onNextTask: () => void
  hints: string[]
  requestHint: () => void
  hintLoading: boolean
  hintError: string | null
  canRequestHint: boolean
  difficulty: 'easy' | 'medium' | 'hard'
  onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard') => void
}

export function TaskCard({
  task,
  isLoading,
  error,
  selectedAnswer,
  isCorrect,
  gradingDetails,
  onAnswerSelect,
  onAnswerSubmit,
  onNextTask,
  hints,
  requestHint,
  hintLoading,
  hintError,
  canRequestHint,
  difficulty,
  onDifficultyChange,
}: TaskCardProps) {
  const { t } = useTranslation()
  const [showFeedback, setShowFeedback] = useState(false)

  // Handle feedback visibility
  useEffect(() => {
    if (isCorrect === false) {
      setShowFeedback(true)
      const timer = setTimeout(() => {
        setShowFeedback(false)
        setTimeout(() => {
          onAnswerSelect(null)
        }, 200)
      }, 3000)
      return () => {
        clearTimeout(timer)
      }
    } else if (isCorrect === true) {
      setShowFeedback(true)
    } else {
      setShowFeedback(false)
    }
  }, [isCorrect, onAnswerSelect])

  // Error state
  if (error) {
    return (
      <Card className="p-4 sm:p-8 border-red-200 bg-red-50 shadow-2xl">
        <div className="text-center">
          <h3 className="text-xl font-bold text-red-900 mb-2">
            {t('error.title', { defaultValue: 'Oops!' })}
          </h3>
          <p className="text-red-700 mb-4">{error}</p>
          <Button onClick={onNextTask} variant="outline" className="rounded-xl">
            {t('error.retry', { defaultValue: 'Try Again' })}
          </Button>
        </div>
      </Card>
    )
  }

  // Loading state
  if (isLoading || !task) {
    return (
      <Card className="p-4 sm:p-8 shadow-2xl bg-card">
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
          </div>
        </div>
      </Card>
    )
  }

  // Get explanation for correct answer
  const getExplanation = () => {
    if (!isCorrect) return ''

    switch (task.type) {
      case 'single_choice':
        if (selectedAnswer !== null) {
          const scTask = task as SingleChoiceTask
          return scTask.options[selectedAnswer as number]?.explanation || ''
        }
        return ''
      case 'yes_no':
        return (task as YesNoTask).explanation
      case 'number_input':
        return (task as NumberInputTask).explanation
      case 'multi_select':
        return (task as MultiSelectTask).explanation
      case 'ordering':
        return (task as OrderingTask).explanation
      case 'fill_in_blank':
        return (task as FillInBlankTask).explanation
      default:
        return ''
    }
  }

  // Render the appropriate answer component based on task type
  const renderAnswerComponent = () => {
    // Map props based on task type
    switch (task.type) {
      case 'single_choice': {
        const scTask = task as SingleChoiceTask
        const AnswerComponent = answerTypeComponents.single_choice
        return (
          <AnswerComponent
            options={scTask.options}
            selectedAnswer={selectedAnswer as number | null}
            onAnswerSelect={(index) => onAnswerSelect(index)}
            isLoading={false}
            isLocked={isCorrect === true}
          />
        )
      }
      case 'yes_no': {
        const AnswerComponent = answerTypeComponents.yes_no
        return (
          <AnswerComponent
            selectedAnswer={selectedAnswer as boolean | null}
            onAnswerSelect={(answer) => onAnswerSelect(answer)}
            isLoading={false}
            isLocked={isCorrect === true}
          />
        )
      }
      case 'number_input': {
        const niTask = task as NumberInputTask
        const AnswerComponent = answerTypeComponents.number_input
        return (
          <AnswerComponent
            expectedAnswer={niTask.answer}
            unit={niTask.unit}
            unitOptions={niTask.unitOptions}
            selectedAnswer={selectedAnswer as { value: number | null; unit?: string } | null}
            onAnswerSelect={(answer) => onAnswerSelect(answer)}
            isLoading={false}
            isLocked={isCorrect === true}
          />
        )
      }
      case 'multi_select': {
        const msTask = task as MultiSelectTask
        const AnswerComponent = answerTypeComponents.multi_select
        return (
          <AnswerComponent
            options={msTask.options}
            expectedCount={msTask.expectedCount}
            selectedAnswer={selectedAnswer as number[] | null}
            onAnswerSelect={(indices) => onAnswerSelect(indices)}
            isLoading={false}
            isLocked={isCorrect === true}
          />
        )
      }
      case 'ordering': {
        const oTask = task as OrderingTask
        const AnswerComponent = answerTypeComponents.ordering
        return (
          <AnswerComponent
            items={oTask.items}
            selectedAnswer={selectedAnswer as string[] | null}
            onAnswerSelect={(order) => onAnswerSelect(order)}
            isLoading={false}
            isLocked={isCorrect === true}
          />
        )
      }
      case 'fill_in_blank': {
        const fibTask = task as FillInBlankTask
        const AnswerComponent = answerTypeComponents.fill_in_blank
        return (
          <AnswerComponent
            task={fibTask.task}
            blanksCount={fibTask.blanks.length}
            selectedAnswer={selectedAnswer as string[] | null}
            onAnswerSelect={(answers) => onAnswerSelect(answers)}
            isLoading={false}
            isLocked={isCorrect === true}
          />
        )
      }
      default:
        // This should never happen with a properly typed Task union
        return <div className="text-red-500">Unknown task type</div>
    }
  }

  const explanation = getExplanation()

  return (
    <Card className="p-4 sm:p-8 shadow-2xl bg-card">
      {/* Header with title and difficulty */}
      <div className="flex items-start justify-between mb-4 sm:mb-6 gap-2">
        <h2 className="text-xl sm:text-2xl font-bold text-card-foreground">{task.title}</h2>
        <DifficultySelector
          difficulty={difficulty}
          onDifficultyChange={onDifficultyChange}
        />
      </div>

      {/* Task content */}
      <MarkdownRenderer
        content={task.task}
        className="prose max-w-none mb-4 sm:mb-6"
        enableMath={true}
        enableMermaid={true}
        enableCode={true}
      />

      {/* Answer options */}
      {renderAnswerComponent()}

      {/* Feedback */}
      {showFeedback && (
        <div
          className={cn(
            'p-4 rounded-xl mb-4 animate-in fade-in slide-in-from-top-2',
            isCorrect
              ? 'bg-green-100 border-2 border-green-300'
              : 'bg-red-100 border-2 border-red-300'
          )}
        >
          <p
            className={cn(
              'font-semibold text-center',
              isCorrect ? 'text-green-900' : 'text-red-900'
            )}
          >
            {isCorrect
              ? t('feedback.correct', { defaultValue: 'Correct! Well done!' })
              : gradingDetails
              ? // Granular feedback for number_input tasks
                gradingDetails.numberCorrect && gradingDetails.unitCorrect === false
                ? t('feedback.numberCorrectUnitWrong', {
                    defaultValue: 'The number is correct, but check the unit'
                  })
                : !gradingDetails.numberCorrect && gradingDetails.unitCorrect === true
                ? t('feedback.unitCorrectNumberWrong', {
                    defaultValue: 'The unit is correct, but check your calculation'
                  })
                : t('feedback.incorrect', {
                    defaultValue: 'Not quite. Try again!',
                  })
              : t('feedback.incorrect', {
                  defaultValue: 'Not quite. Try again!',
                })}
          </p>
          {isCorrect && explanation && (
            <div className="mt-2 p-3 bg-white rounded-lg">
              <MarkdownRenderer
                content={explanation}
                enableMath={true}
                enableMermaid={false}
                enableCode={false}
              />
            </div>
          )}
        </div>
      )}

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
    </Card>
  )
}
