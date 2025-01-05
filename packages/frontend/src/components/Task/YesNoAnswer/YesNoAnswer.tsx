import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { FadeInOut, Interactive, Sequence } from '../../base/Animations'
import { Card } from '../../base/Card'
import { TaskOption } from '../TaskCard/TaskOption'
import { Feedback } from '../Feedback'
import { SolutionExplanation } from '../TaskCard/SolutionExplanation'
import { cn } from '../../../utils/cn'
import { YesNoAnswerProps } from './types'
import { styles } from './styles'
import { TIMING } from '../constants'

export function YesNoAnswer({
  selectedAnswer,
  onAnswerSelect,
  onSubmit,
  onNextTask,
  isLoading = false,
  solution
}: YesNoAnswerProps) {
  const { t } = useTranslation()
  const [showFeedback, setShowFeedback] = useState(false)

  // Handle feedback visibility and answer reset
  useEffect(() => {
    if (selectedAnswer !== null && selectedAnswer !== solution.answer) {
      setShowFeedback(true)
      const timeoutId = setTimeout(() => {
        setShowFeedback(false)
        // Wait for fade out animation before resetting
        setTimeout(() => {
          onAnswerSelect(null)
        }, 200) // Match FadeInOut default duration
      }, TIMING.WRONG_ANSWER_RESET)
      return () => clearTimeout(timeoutId)
    } else if (selectedAnswer === solution.answer) {
      setShowFeedback(true)
    } else {
      setShowFeedback(false)
    }
  }, [selectedAnswer, onAnswerSelect, solution])

  if (isLoading) {
    return (
      <>
        <div className={styles.grid}>
          {[1, 2].map((_, index) => (
            <Card key={index} className={styles.option.base}>
              <div className={styles.loading.option} />
            </Card>
          ))}
        </div>
        <div className={styles.action.base}>
          <div className={styles.loading.button} />
        </div>
      </>
    )
  }

  const isCorrect = selectedAnswer === solution.answer

  return (
    <div className={styles.base}>
      <div className={styles.grid}>
        {[true, false].map((answer) => (
          <Interactive 
            key={answer.toString()}
            onClick={selectedAnswer === null ? () => onAnswerSelect(answer) : undefined}
            disabled={selectedAnswer !== null}
            className={styles.option.base}
          >
            <Card
              variant={
                selectedAnswer !== null && answer === selectedAnswer
                  ? isCorrect
                    ? 'success'
                    : 'error'
                  : selectedAnswer === answer && selectedAnswer === null
                    ? 'primary'
                    : 'default'
              }
            >
              <div className={styles.option.content}>
                {t(`task.${answer ? 'yes' : 'no'}`)}
              </div>
            </Card>
          </Interactive>
        ))}
      </div>

      <div className={styles.feedback}>
        <FadeInOut show={showFeedback}>
          <Feedback 
            message={isCorrect ? t('feedback.correct') : t('feedback.incorrect')}
            variant={isCorrect ? 'success' : 'error'}
            showIcon
          />
          {isCorrect && (
            <SolutionExplanation explanation={solution.explanation} />
          )}
        </FadeInOut>
      </div>
      
      <Sequence key={selectedAnswer === null ? 'check' : isCorrect ? 'next' : 'try-again'}>
        {selectedAnswer === null ? (
          <TaskOption
            onClick={onSubmit}
            label={t('task.checkAnswer')}
            disabled={selectedAnswer === null}
            variant="primary"
            size="lg"
            className={cn(
              styles.action.base,
              selectedAnswer !== null && styles.action.ready
            )}
          />
        ) : isCorrect ? (
          <TaskOption
            onClick={onNextTask}
            label={t('task.nextTask')}
            variant="success"
            size="lg"
            className={styles.action.base}
          />
        ) : (
          <TaskOption
            onClick={() => onAnswerSelect(null)}
            label={t('task.tryAgain')}
            variant="warning"
            size="lg"
            className={styles.action.base}
          />
        )}
      </Sequence>
    </div>
  )
} 