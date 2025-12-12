import { useTranslation } from 'react-i18next'
import { MarkdownRenderer } from '@/app/common/MarkdownRenderer'
import { PlayButton } from '@/app/common/PlayButton'
import { Task } from './types'
import { NumberInputGradingDetails } from './useTaskAnswer'
import { cn } from '@/app/common/cn'

interface TaskFeedbackProps {
  showFeedback: boolean
  isCorrect: boolean | null
  gradingDetails: NumberInputGradingDetails | null
  task: Task
}

export function TaskFeedback({ showFeedback, isCorrect, gradingDetails, task }: TaskFeedbackProps) {
  const { t } = useTranslation()

  if (!showFeedback) {
    return null
  }

  return (
    <div
      className={cn(
        'p-4 rounded-xl mb-4 animate-in fade-in slide-in-from-top-2',
        isCorrect ? 'bg-green-100 border-2 border-green-300' : 'bg-red-100 border-2 border-red-300'
      )}
    >
      <p className={cn('font-semibold text-center', isCorrect ? 'text-green-900' : 'text-red-900')}>
        {isCorrect
          ? t('feedback.correct', { defaultValue: 'Correct! Well done!' })
          : gradingDetails
            ? // Granular feedback for number_input tasks
              gradingDetails.numberCorrect && gradingDetails.unitCorrect === false
              ? t('feedback.numberCorrectUnitWrong', {
                  defaultValue: 'The number is correct, but check the unit',
                })
              : !gradingDetails.numberCorrect && gradingDetails.unitCorrect === true
                ? t('feedback.unitCorrectNumberWrong', {
                    defaultValue: 'The unit is correct, but check your calculation',
                  })
                : t('feedback.incorrect', {
                    defaultValue: 'Not quite. Try again!',
                  })
            : t('feedback.incorrect', {
                defaultValue: 'Not quite. Try again!',
              })}
      </p>
      {isCorrect && task.explanation && (
        <div className="mt-2 flex items-start gap-2">
          <MarkdownRenderer
            content={task.explanation}
            className="flex-1"
            enableMath={true}
            enableMermaid={false}
            enableCode={false}
          />
          <PlayButton taskId={task.taskId} field="explanation" />
        </div>
      )}
    </div>
  )
}
