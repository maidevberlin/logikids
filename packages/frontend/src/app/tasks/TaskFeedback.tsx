import { useTranslation } from 'react-i18next'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { Task, SingleChoiceTask, YesNoTask, NumberInputTask, MultiSelectTask, OrderingTask, FillInBlankTask } from './types'
import { NumberInputGradingDetails } from './useTaskAnswer'
import { cn } from '@/lib/utils'

interface TaskFeedbackProps {
  showFeedback: boolean
  isCorrect: boolean | null
  gradingDetails: NumberInputGradingDetails | null
  task: Task
  selectedAnswer: number | boolean | string[] | number[] | { value: number | null; unit?: string } | null
}

export function TaskFeedback({ showFeedback, isCorrect, gradingDetails, task, selectedAnswer }: TaskFeedbackProps) {
  const { t } = useTranslation()

  // Get explanation for correct answer
  const getExplanation = () => {
    if (!isCorrect) return ''

    switch (task.type) {
      case 'single_choice':
        return (task as SingleChoiceTask).explanation
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

  if (!showFeedback) {
    return null
  }

  const explanation = getExplanation()

  return (
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
        <div className="mt-2">
          <MarkdownRenderer
            content={explanation}
            enableMath={true}
            enableMermaid={false}
            enableCode={false}
          />
        </div>
      )}
    </div>
  )
}
