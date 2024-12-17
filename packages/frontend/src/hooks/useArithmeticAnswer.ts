import { useState } from 'react'

export function useArithmeticAnswer() {
  const [answer, setAnswer] = useState<number | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  const handleAnswerChange = (value: number) => {
    setAnswer(value)
    setIsCorrect(null)
  }

  const handleAnswerSubmit = (solution: number) => {
    setSelectedAnswer(answer)
    setIsCorrect(answer === solution)
  }

  const reset = () => {
    setAnswer(null)
    setSelectedAnswer(null)
    setIsCorrect(null)
  }

  return {
    answer,
    selectedAnswer,
    isCorrect,
    handleAnswerChange,
    handleAnswerSubmit,
    reset,
  }
} 