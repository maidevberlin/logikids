interface AnswerInputProps {
  answer: number | null
  isDisabled: boolean
  onChange: (value: number) => void
  shouldShake?: boolean
}

export function AnswerInput({ answer, isDisabled, onChange, shouldShake }: AnswerInputProps) {
  return (
    <div>
      <label htmlFor="answer" className="sr-only">
        Your answer
      </label>
      <input
        type="text"
        name="answer"
        id="answer"
        value={answer?.toString() || ''}
        onChange={(e) => onChange(Number(e.target.value.trim()))}
        disabled={isDisabled}
        className={`block w-full rounded-lg border-gray-300 shadow-sm 
          focus:border-indigo-500 focus:ring-indigo-500 
          disabled:opacity-50 disabled:cursor-not-allowed
          text-lg py-4 px-6
          ${shouldShake ? 'animate-shake' : ''}`}
        placeholder="Enter your answer..."
      />
    </div>
  )
} 