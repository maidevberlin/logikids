import { useState, useCallback } from 'react'

interface UseTaskAnswerOptions {
  type: 'arithmetic' | 'geometry'
  validator?: (value: string) => boolean
}

export function useTaskAnswer({ type, validator }: UseTaskAnswerOptions) {
  const [answer, setAnswer] = useState<string>('')
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  const handleAnswerChange = useCallback((value: string) => {
    if (type === 'arithmetic' && !(value === '' || /^\d+$/.test(value))) {
      return
    }
    
    if (validator && !validator(value)) {
      return
    }

    setAnswer(value)
    setSelectedAnswer(null)
    setIsCorrect(null)
  }, [type, validator])

  const handleAnswerSubmit = useCallback((solution: number | string) => {
    const correct = answer === String(solution)
    setIsCorrect(correct)
    setSelectedAnswer(answer)
  }, [answer])

  const isValid = answer !== '' && (!validator || validator(answer))

  return { answer, selectedAnswer, isCorrect, handleAnswerChange, handleAnswerSubmit, isValid }
} 