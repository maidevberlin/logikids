import { useState } from 'react'

export function useArithmeticAnswer() {
  const [answer, setAnswer] = useState('')
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  const handleAnswerChange = (value: string) => {
    setAnswer(value)
    setSelectedAnswer(value)
  }

  const handleAnswerSubmit = (solution: string) => {
    const normalizedAnswer = answer.trim()
    const normalizedSolution = String(solution).trim()
    setIsCorrect(normalizedAnswer === normalizedSolution)
  }

  const reset = () => {
    setAnswer('')
    setSelectedAnswer('')
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