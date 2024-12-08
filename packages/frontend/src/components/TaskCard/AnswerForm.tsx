interface AnswerFormProps {
  answer: string
  selectedAnswer: string | null
  isCorrect: boolean | null
  onAnswerChange: (value: string) => void
  onSubmit: (event: React.FormEvent) => void
  onNextTask?: () => void
}

export function AnswerForm({
  answer,
  selectedAnswer,
  isCorrect,
  onAnswerChange,
  onSubmit,
  onNextTask,
}: AnswerFormProps) {
  return (
    <div className="mt-8">
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label htmlFor="answer" className="sr-only">
            Your answer
          </label>
          <input
            type="text"
            name="answer"
            id="answer"
            value={answer}
            onChange={(e) => onAnswerChange(e.target.value)}
            disabled={isCorrect === true}
            className="block w-full rounded-lg border-gray-300 shadow-sm 
              focus:border-indigo-500 focus:ring-indigo-500 
              disabled:opacity-50 disabled:cursor-not-allowed
              text-lg py-4 px-6"
            placeholder="Enter your answer..."
          />
        </div>
        {isCorrect === true && onNextTask ? (
          <button
            type="button"
            onClick={onNextTask}
            className="w-full py-4 px-6 text-lg font-medium rounded-lg border border-transparent 
              bg-green-600 text-white shadow-sm 
              hover:bg-green-700 
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 
              transition-colors duration-200"
            aria-label="Proceed to next task"
          >
            Next Task
          </button>
        ) : (
          <button
            type="submit"
            disabled={isCorrect === true || !answer}
            className="w-full py-4 px-6 text-lg font-medium rounded-lg border border-transparent 
              bg-indigo-600 text-white shadow-sm 
              hover:bg-indigo-700 
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200"
            aria-label="Submit your answer"
          >
            Submit Answer
          </button>
        )}
      </form>
      {selectedAnswer && (
        <div
          className={`mt-6 p-4 rounded-lg text-lg ${
            isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
          role="alert"
          aria-live="polite"
        >
          <p className="font-medium">
            {isCorrect ? (
              <>
                Correct! Well done! 
                {onNextTask && <span className="block mt-1">Press Enter or click Next Task to continue.</span>}
              </>
            ) : (
              'Not quite right. Try another answer!'
            )}
          </p>
        </div>
      )}
    </div>
  )
} 