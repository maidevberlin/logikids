import { useState, useCallback } from 'react'

interface UseArithmeticAnswerReturn {
  answer: string
  selectedAnswer: string | null
  isCorrect: boolean | null
  handleAnswerChange: (value: string) => void
  handleAnswerSubmit: (solution: number) => void
  isValid: boolean
}

export function useArithmeticAnswer(): UseArithmeticAnswerReturn {
  const [answer, setAnswer] = useState<string>('')
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  const handleAnswerChange = useCallback((value: string) => {
    // Only allow numeric input (including empty string for backspace)
    if (value === '' || /^\d+$/.test(value)) {
      // If the answer changes, reset the submission states
      if (value !== selectedAnswer) {
        setSelectedAnswer(null)
        setIsCorrect(null)
      }
      setAnswer(value)
    }
  }, [selectedAnswer])

  const handleAnswerSubmit = useCallback((solution: number) => {
    const numericAnswer = Number(answer)
    
    // Validate input
    if (isNaN(numericAnswer)) {
      return
    }

    const correct = numericAnswer === solution
    setIsCorrect(correct)
    setSelectedAnswer(answer)
  }, [answer])

  // Validate if the current answer is a valid number
  const isValid = answer !== '' && !isNaN(Number(answer))

  return {
    answer,
    selectedAnswer,
    isCorrect,
    handleAnswerChange,
    handleAnswerSubmit,
    isValid,
  }
} 