import { motion, AnimatePresence } from 'framer-motion'
import { TaskOption } from './TaskOption'
import { Feedback } from './Feedback'

interface MultipleChoiceAnswerProps {
  options: string[]
  selectedAnswer: number | null
  isCorrect: boolean | null
  onAnswerSelect: (index: number) => void
  onSubmit: () => void
  onNextTask: () => void
}

export function MultipleChoiceAnswer({
  options,
  selectedAnswer,
  isCorrect,
  onAnswerSelect,
  onSubmit,
  onNextTask,
}: MultipleChoiceAnswerProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {options.map((text, index) => (
          <motion.button
            key={index}
            onClick={() => onAnswerSelect(index)}
            disabled={isCorrect !== null}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              p-4 rounded-lg border-2 transition-colors text-left
              disabled:cursor-not-allowed
              ${
                selectedAnswer === index
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300'
              }
              ${
                isCorrect !== null && index === selectedAnswer
                  ? isCorrect
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : ''
              }
            `}
          >
            <div className="text-lg font-medium text-gray-900">
              {text}
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {isCorrect !== null && (
          <Feedback isCorrect={isCorrect} />
        )}
      </AnimatePresence>
      
      <motion.div 
        className="flex justify-end"
        layout
      >
        {isCorrect === null ? (
          <TaskOption
            onSelect={onSubmit}
            label="Check Answer"
            disabled={selectedAnswer === null}
            variant="primary"
          />
        ) : isCorrect ? (
          <TaskOption
            onSelect={onNextTask}
            label="Next Task"
            variant="success"
          />
        ) : (
          <TaskOption
            onSelect={() => {
              // Re-enable answer selection
              onAnswerSelect(-1)
            }}
            label="Try Again"
            variant="warning"
          />
        )}
      </motion.div>
    </div>
  )
} 