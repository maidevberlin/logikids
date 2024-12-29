import { useState, useEffect, useRef } from 'react'
import { AnswerInput } from './AnswerInput'

interface AnswerFormProps {
  answer: number | null
  selectedAnswer: number | null
  isCorrect: boolean | null
  onAnswerChange: (value: number | null) => void
  onSubmit: (event: React.FormEvent) => void
  onNextTask?: () => void
  onRequestHint?: () => void
}

export function AnswerForm({
  answer,
  selectedAnswer,
  isCorrect,
  onAnswerChange,
  onSubmit,
  onNextTask,
  onRequestHint,
}: AnswerFormProps) {
  const [shouldShake, setShouldShake] = useState(false)
  const lastProcessedAnswer = useRef<number | null>(null)

  useEffect(() => {
    // Only process if it's a wrong answer and different from the last processed one
    if (isCorrect === false && 
        selectedAnswer !== null && 
        selectedAnswer !== lastProcessedAnswer.current) {
      setShouldShake(true)
      setTimeout(() => setShouldShake(false), 600)
      onRequestHint?.()
      lastProcessedAnswer.current = selectedAnswer
    }
  }, [isCorrect, selectedAnswer, onRequestHint])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    onSubmit(event)
  }

  return (
    <div className="mt-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <AnswerInput 
          answer={answer}
          isDisabled={isCorrect === true}
          onChange={onAnswerChange}
          shouldShake={shouldShake}
        />
        
        <button
          type={isCorrect ? 'button' : 'submit'}
          onClick={isCorrect ? onNextTask : undefined}
          disabled={!isCorrect && answer === null}
          className={`w-full py-4 px-6 text-lg font-medium rounded-lg border border-transparent 
            ${isCorrect 
              ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' 
              : 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500'
            }
            text-white shadow-sm 
            focus:outline-none focus:ring-2 focus:ring-offset-2 
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-200`}
          aria-label={isCorrect ? 'Proceed to next task' : 'Submit your answer'}
        >
          {isCorrect ? 'Next Task' : 'Submit Answer'}
        </button>

        {isCorrect && (
          <div className="mt-4 text-center text-green-600 font-medium">
            Correct! Well done!
          </div>
        )}
      </form>
    </div>
  )
} 