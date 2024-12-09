import { useState, useCallback } from 'react'

interface UseGeometryAnswerReturn {
  answer: string
  selectedAnswer: string | null
  isCorrect: boolean | null
  handleAnswerChange: (value: string) => void
  handleAnswerSubmit: (solution: number | string) => void
  isValid: boolean
}

export function useGeometryAnswer(): UseGeometryAnswerReturn {
  const [answer, setAnswer] = useState<string>('')
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  const handleAnswerChange = useCallback((value: string) => {
    if (value !== selectedAnswer) {
      setSelectedAnswer(null)
      setIsCorrect(null)
    }
    setAnswer(value)
  }, [selectedAnswer])

  const handleAnswerSubmit = useCallback((solution: number | string) => {
    const correct = answer === String(solution)
    setIsCorrect(correct)
    setSelectedAnswer(answer)
  }, [answer])

  const isValid = answer !== ''

  return {
    answer,
    selectedAnswer,
    isCorrect,
    handleAnswerChange,
    handleAnswerSubmit,
    isValid,
  }
} 