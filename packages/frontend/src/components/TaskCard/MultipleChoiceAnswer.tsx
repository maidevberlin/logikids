import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FadeInOut } from '../base/Animations/FadeInOut'
import { Card } from '../base/Card'
import { TaskOption } from './TaskOption'
import { Feedback } from './Feedback'
import { SolutionExplanation } from './SolutionExplanation'

interface MultipleChoiceAnswerProps {
  options: string[]
  selectedAnswer: number | null
  isCorrect: boolean | null
  onAnswerSelect: (index: number | null) => void
  onSubmit: () => void
  onNextTask: () => void
  solutionExplanation: string
  isLoading?: boolean
}

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
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((_, index) => (
            <Card key={index} className="p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              </div>
            </Card>
          ))}
        </div>
        <div className="w-full">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
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
            interactive={isCorrect === null}
            onClick={() => isCorrect === null && onAnswerSelect(index)}
            className={`
              p-4 transition-all duration-200
              ${selectedAnswer === index && isCorrect === null ? 'ring-2 ring-primary-500 ring-offset-2' : ''}
            `}
          >
            <div 
              className="prose prose-blue max-w-none text-left"
              dangerouslySetInnerHTML={{ __html: text }} 
            />
          </Card>
        ))}
      </div>

      <FadeInOut show={isCorrect !== null ? true : false} className="space-y-4">
        {isCorrect !== null && (
          <>
            <Feedback isCorrect={isCorrect} />
            {isCorrect && (
              <SolutionExplanation explanation={solutionExplanation} />
            )}
          </>
        )}
      </FadeInOut>
      
      <motion.div 
        className="w-full"
        layout
      >
        {isCorrect === null ? (
          <TaskOption
            onSelect={onSubmit}
            label={t('task.checkAnswer')}
            disabled={selectedAnswer === null}
            variant="primary"
            size="lg"
            className={`
              w-full
              ${selectedAnswer !== null && isCorrect === null ? 'animate-pulse-subtle border-2 border-primary-300 hover:bg-primary-50' : ''}
            `}
          />
        ) : isCorrect ? (
          <TaskOption
            onSelect={onNextTask}
            label={t('task.nextTask')}
            variant="success"
            size="lg"
            className="w-full"
          />
        ) : (
          <TaskOption
            onSelect={handleTryAgain}
            label={t('task.tryAgain')}
            variant="warning"
            size="lg"
            className="w-full"
          />
        )}
      </motion.div>
    </div>
  )
} 