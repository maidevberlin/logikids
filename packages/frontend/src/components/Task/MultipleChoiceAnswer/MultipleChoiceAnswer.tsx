import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { FadeInOut, Interactive, Sequence } from '../../base/Animations'
import { Card } from '../../base/Card'
import { TaskOption } from '../TaskCard/TaskOption'
import { Feedback } from '../Feedback'
import { SolutionExplanation } from '../TaskCard/SolutionExplanation'
import { cn } from '../../../utils/cn'
import { MultipleChoiceAnswerProps } from './types'
import { styles } from './styles'
import { TIMING } from '../constants'

export function MultipleChoiceAnswer({
  options,
  selectedAnswer,
  isCorrect,
  onAnswerSelect,
  onSubmit,
  onNextTask,
  solutionExplanation,
  isLoading = false
}: MultipleChoiceAnswerProps) {
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

  if (isLoading) {
    return (
      <>
        <div className={styles.grid}>
          {[1, 2, 3, 4].map((_, index) => (
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

  return (
    <div className={styles.base}>
      <div className={styles.grid}>
        {options.map((text, index) => (
          <Interactive 
            key={index}
            onClick={isCorrect === null ? () => onAnswerSelect(index) : undefined}
            disabled={isCorrect !== null}
            className={styles.option.base}
          >
            <Card
              variant={
                isCorrect !== null && index === selectedAnswer
                  ? isCorrect
                    ? 'success'
                    : 'error'
                  : selectedAnswer === index && isCorrect === null
                    ? 'primary'
                    : 'default'
              }
            >
              <div 
                className={styles.option.content}
                dangerouslySetInnerHTML={{ __html: text }} 
              />
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
            <SolutionExplanation explanation={solutionExplanation} />
          )}
        </FadeInOut>
      </div>
      
      <Sequence key={isCorrect === null ? 'check' : isCorrect ? 'next' : 'try-again'}>
        {isCorrect === null ? (
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