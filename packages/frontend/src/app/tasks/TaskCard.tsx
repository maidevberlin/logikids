import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/app/common/ui/card'
import { Button } from '@/app/common/ui/button'
import { MarkdownRenderer } from '@/app/common/MarkdownRenderer'
import { PlayButton } from '@/app/common/PlayButton'
import { TaskLoadingState } from './TaskLoadingState'
import { TaskHeader } from './TaskHeader'
import { TaskAnswerRenderer } from './TaskAnswerRenderer'
import { TaskFeedback } from './TaskFeedback'
import { TaskActions } from './TaskActions'
import { TaskCostDisplay } from './TaskCostDisplay'
import { Task, TaskUsageInfo } from './types'
import { NumberInputGradingDetails } from './useTaskAnswer'
import { useTaskLoadingCalibration } from '@/hooks/useTaskLoadingCalibration'

interface TaskCardProps {
  task: Task | null
  isLoading: boolean
  error: string | null
  subject: string
  selectedAnswer:
    | number
    | boolean
    | string[]
    | number[]
    | { value: number | null; unit?: string }
    | null
  isCorrect: boolean | null
  gradingDetails: NumberInputGradingDetails | null
  onAnswerSelect: (
    answer: number | boolean | string[] | number[] | { value: number | null; unit?: string } | null
  ) => void
  onAnswerSubmit: () => void
  onNextTask: () => void
  hints: string[]
  requestHint: () => void
  hintLoading: boolean
  hintError: string | null
  canRequestHint: boolean
  difficulty: 'easy' | 'medium' | 'hard'
  onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard') => void
  hintUsage?: TaskUsageInfo
}

export function TaskCard({
  task,
  isLoading,
  error,
  subject,
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
  hintUsage,
}: TaskCardProps) {
  const { t } = useTranslation()
  const [showFeedback, setShowFeedback] = useState(false)

  // Load time calibration
  const { recordLoadTime } = useTaskLoadingCalibration()
  const loadStartRef = useRef<number | null>(null)

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

  // Track when loading starts
  useEffect(() => {
    if (isLoading && !loadStartRef.current) {
      loadStartRef.current = Date.now()
    }
  }, [isLoading])

  // Record when loading completes successfully
  useEffect(() => {
    if (!isLoading && task && loadStartRef.current && !error) {
      const loadTime = Date.now() - loadStartRef.current
      recordLoadTime(loadTime)
      loadStartRef.current = null
    }

    // Cleanup if loading stops without success (error or navigation)
    if (!isLoading && !task) {
      loadStartRef.current = null
    }
  }, [isLoading, task, error, recordLoadTime])

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
    return <TaskLoadingState subject={subject} />
  }

  return (
    <Card className="p-4 sm:p-8 shadow-2xl bg-card">
      {/* Header with title and difficulty */}
      <TaskHeader task={task} difficulty={difficulty} onDifficultyChange={onDifficultyChange} />

      {/* Task content */}
      <div className="flex items-start gap-2 mb-4 sm:mb-6">
        <MarkdownRenderer
          content={task.task}
          className="prose max-w-none flex-1"
          enableMath={true}
          enableMermaid={true}
          enableCode={true}
        />
        <PlayButton taskId={task.taskId} field="task" />
      </div>

      {/* Answer options */}
      <TaskAnswerRenderer
        task={task}
        selectedAnswer={selectedAnswer}
        onAnswerSelect={onAnswerSelect}
        isCorrect={isCorrect}
      />

      {/* Feedback */}
      <TaskFeedback
        showFeedback={showFeedback}
        isCorrect={isCorrect}
        gradingDetails={gradingDetails}
        task={task}
      />

      {/* Action buttons and hints */}
      <TaskActions
        taskId={task.taskId}
        isLoading={isLoading}
        isCorrect={isCorrect}
        selectedAnswer={selectedAnswer}
        onAnswerSubmit={onAnswerSubmit}
        onAnswerSelect={onAnswerSelect}
        onNextTask={onNextTask}
        hints={hints}
        requestHint={requestHint}
        hintLoading={hintLoading}
        hintError={hintError}
        canRequestHint={canRequestHint}
      />

      {/* Cost information */}
      <TaskCostDisplay taskUsage={task.usage} hintUsage={hintUsage} />
    </Card>
  )
}
