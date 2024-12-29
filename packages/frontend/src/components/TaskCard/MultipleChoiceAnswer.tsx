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
  solutionExplanation: string
}

export function MultipleChoiceAnswer({
  options,
  selectedAnswer,
  isCorrect,
  onAnswerSelect,
  onSubmit,
  onNextTask,
  solutionExplanation
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
            <div 
              className="text-lg font-medium text-gray-900 prose prose-blue max-w-none"
              dangerouslySetInnerHTML={{ __html: text }}
            />
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {isCorrect !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <Feedback isCorrect={isCorrect} />
            {isCorrect && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-green-800 mb-2">Solution Explanation</h3>
                <div 
                  className="prose prose-blue max-w-none text-green-700"
                  dangerouslySetInnerHTML={{ __html: solutionExplanation }}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div 
        className="w-full"
        layout
      >
        {isCorrect === null ? (
          <TaskOption
            onSelect={onSubmit}
            label="Check Answer"
            disabled={selectedAnswer === null}
            variant="primary"
            className="w-full"
          />
        ) : isCorrect ? (
          <TaskOption
            onSelect={onNextTask}
            label="Next Task"
            variant="success"
            className="w-full"
          />
        ) : (
          <TaskOption
            onSelect={() => {
              // Re-enable answer selection
              onAnswerSelect(-1)
            }}
            label="Try Again"
            variant="warning"
            className="w-full"
          />
        )}
      </motion.div>
    </div>
  )
} 