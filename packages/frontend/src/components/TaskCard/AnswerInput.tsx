import { ChangeEvent, useState } from 'react'

interface AnswerInputProps {
  answer: number | null
  isDisabled?: boolean
  onChange: (value: number | null) => void
  shouldShake?: boolean
}

export function AnswerInput({ 
  answer, 
  isDisabled = false, 
  onChange,
  shouldShake = false
}: AnswerInputProps) {
  const [inputValue, setInputValue] = useState<string>('')

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
      .replace(/[^\d.,\-]/g, '') // Allow digits, comma, dot, and minus
    
    setInputValue(value)

    // Don't parse incomplete decimal numbers
    if (value.endsWith('.') || value.endsWith(',')) {
      return
    }

    // Handle empty input
    if (!value) {
      onChange(null)
      return
    }

    const numericValue = parseFloat(value.replace(',', '.'))
    
    // Only update if it's a valid number (including 0)
    if (!isNaN(numericValue)) {
      onChange(numericValue)
    }
  }

  return (
    <div>
      <input
        type="text"
        inputMode="decimal"
        value={inputValue || answer?.toString() || ''}
        onChange={handleChange}
        disabled={isDisabled}
        className={`w-full px-4 py-3 text-2xl text-center rounded-lg border 
          border-gray-300 focus:border-primary-500 focus:ring-primary-500
          disabled:bg-gray-100 disabled:text-gray-500
          ${shouldShake ? 'animate-shake' : ''}
        `}
        placeholder="Enter your answer"
        aria-label="Your answer"
      />
    </div>
  )
} 