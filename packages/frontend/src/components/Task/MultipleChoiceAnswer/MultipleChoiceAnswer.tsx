import { useTranslation } from 'react-i18next'
import { FadeInOut } from '../../base/Animations/FadeInOut' 
import { Card } from '../../base/Card'
import { TaskOption } from '../TaskCard/TaskOption'
import { Feedback } from '../Feedback'
import { SolutionExplanation } from '../TaskCard/SolutionExplanation'
import { cn } from '../../../utils/cn'
import { MultipleChoiceAnswerProps } from './types'
import { styles } from './styles'

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

  const handleTryAgain = () => {
    onAnswerSelect(null)
  }

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
          <Card
            key={index}
            variant={
              isCorrect !== null
                ? index === selectedAnswer
                  ? isCorrect
                    ? 'success'
                    : 'error'
                  : 'default'
                : 'default'
            }
            onClick={isCorrect === null ? () => onAnswerSelect(index) : undefined}
            className={cn(
              styles.option.base,
              selectedAnswer === index && isCorrect === null && styles.option.selected
            )}
          >
            <div 
              className={styles.option.content}
              dangerouslySetInnerHTML={{ __html: text }} 
            />
          </Card>
        ))}
      </div>

      <FadeInOut show={isCorrect !== null ? true : false} className={styles.feedback}>
        {isCorrect !== null && (
          <>
            <Feedback 
              message={isCorrect ? t('feedback.correct') : t('feedback.incorrect')}
              variant={isCorrect ? 'success' : 'error'}
              animate
              showIcon
            />
            {isCorrect && (
              <SolutionExplanation explanation={solutionExplanation} />
            )}
          </>
        )}
      </FadeInOut>
      
      <div className={styles.action.base}>
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
            onClick={handleTryAgain}
            label={t('task.tryAgain')}
            variant="warning"
            size="lg"
            className={styles.action.base}
          />
        )}
      </div>
    </div>
  )
} 