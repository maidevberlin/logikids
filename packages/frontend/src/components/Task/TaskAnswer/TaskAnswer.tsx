import { memo, useState, useEffect } from 'react'
import { MultipleChoiceAnswer } from './MultipleChoiceAnswer'
import { YesNoAnswer } from './YesNoAnswer'
import { HintSection } from '../Hint/HintSection'
import { TaskAnswerProps, TaskAnswerType } from './types'
import { Task, MultipleChoiceTask, YesNoTask } from '../types'
import { FadeInOut, Sequence } from '../../base/Animations'
import { Feedback } from '../Feedback'
import { SolutionExplanation } from '../TaskCard/SolutionExplanation'
import { TaskOption } from '../TaskCard/TaskOption'
import { useTranslation } from 'react-i18next'
import { cn } from '../../../utils/cn'
import { TIMING } from '../constants'

function TaskAnswerComponent<T extends Task>({
  task,
  selectedAnswer,
  isLoading,
  isCorrect,
  onAnswerSelect,
  onAnswerSubmit,
  onNextTask,
  onHintUsed,
}: TaskAnswerProps<T>) {
  const { t } = useTranslation()
  const [showFeedback, setShowFeedback] = useState(false)

  // Handle feedback visibility and answer reset
  useEffect(() => {
    if (isCorrect === false) {
      setShowFeedback(true)
      const timeoutId = setTimeout(() => {
        setShowFeedback(false)
        // Wait for fade out animation before resetting
        setTimeout(() => {
          onAnswerSelect(null)
        }, 200) // Match FadeInOut default duration
      }, TIMING.WRONG_ANSWER_RESET)
      return () => clearTimeout(timeoutId)
    } else if (isCorrect === true) {
      setShowFeedback(true)
    } else {
      setShowFeedback(false)
    }
  }, [isCorrect, onAnswerSelect])

  const renderAnswer = () => {
    switch (task.type) {
      case 'multiple_choice': {
        const multipleChoiceTask = task as MultipleChoiceTask
        const handleMultipleChoiceSelect = (answer: number | null) => {
          onAnswerSelect(answer as TaskAnswerType<T> | null)
        }
        return (
          <MultipleChoiceAnswer
            options={multipleChoiceTask.options}
            selectedAnswer={selectedAnswer as number | null}
            onAnswerSelect={handleMultipleChoiceSelect}
            isLoading={isLoading}
          />
        )
      }
      case 'yes_no': {
        const yesNoTask = task as YesNoTask
        const handleYesNoSelect = (answer: boolean | null) => {
          onAnswerSelect(answer as TaskAnswerType<T> | null)
        }
        return (
          <YesNoAnswer
            selectedAnswer={selectedAnswer as boolean | null}
            onAnswerSelect={handleYesNoSelect}
            isLoading={isLoading}
            solution={yesNoTask.solution}
          />
        )
      }
      default:
        return null
    }
  }

  const getExplanation = () => {
    if (!isCorrect) return ''
    
    switch (task.type) {
      case 'multiple_choice': {
        const multipleChoiceTask = task as MultipleChoiceTask
        return selectedAnswer !== null ? multipleChoiceTask.options[selectedAnswer as number]?.explanation || '' : ''
      }
      case 'yes_no': {
        const yesNoTask = task as YesNoTask
        return yesNoTask.solution.explanation
      }
      default:
        return ''
    }
  }

  return (
    <div>
      {renderAnswer()}

      <div className="mt-4">
        <FadeInOut show={showFeedback}>
          <Feedback 
            message={isCorrect ? t('feedback.correct') : t('feedback.incorrect')}
            variant={isCorrect ? 'success' : 'error'}
            showIcon
          />
          {isCorrect && (
            <SolutionExplanation explanation={getExplanation()} />
          )}
        </FadeInOut>
      </div>
      
      {!isLoading && (
        <Sequence key={isCorrect === null ? 'check' : isCorrect ? 'next' : 'try-again'}>
          {isCorrect === null ? (
            <TaskOption
              onClick={onAnswerSubmit}
              label={t('task.checkAnswer')}
              disabled={selectedAnswer === null}
              variant="primary"
              size="lg"
              className={cn(
                "mt-4 w-full",
                selectedAnswer !== null && "animate-bounce"
              )}
            />
          ) : isCorrect ? (
            <TaskOption
              onClick={onNextTask}
              label={t('task.nextTask')}
              variant="success"
              size="lg"
              className="mt-4 w-full"
            />
          ) : (
            <TaskOption
              onClick={() => onAnswerSelect(null)}
              label={t('task.tryAgain')}
              variant="warning"
              size="lg"
              className="mt-4 w-full"
            />
          )}
        </Sequence>
      )}
      
      {!isLoading && isCorrect !== true && (
        <HintSection
          hints={task.hints}
          hasWrongAnswer={isCorrect === false}
          onHintUsed={onHintUsed}
        />
      )}
    </div>
  )
}

export const TaskAnswer = memo(TaskAnswerComponent) as typeof TaskAnswerComponent 