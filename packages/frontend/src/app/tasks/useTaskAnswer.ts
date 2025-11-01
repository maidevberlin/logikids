import { useState, useCallback } from 'react'
import { Task, MultipleChoiceTask, YesNoTask, TaskAnswerType } from './types'

interface UseTaskAnswerOptions<T extends Task> {
  task: T
  validator?: (value: TaskAnswerType<T>) => boolean
}

export function useTaskAnswer<T extends Task>({ task, validator }: UseTaskAnswerOptions<T>) {
  const [selectedAnswer, setSelectedAnswer] = useState<TaskAnswerType<T> | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  const handleAnswerSelect = useCallback((answer: TaskAnswerType<T>) => {
    if (validator && !validator(answer)) {
      return
    }

    setSelectedAnswer(answer)
    setIsCorrect(null)
  }, [validator])

  const handleAnswerSubmit = useCallback(() => {
    if (!selectedAnswer) return

    let correct: boolean
    if (task.type === 'multiple_choice') {
      const multipleChoiceTask = task as MultipleChoiceTask
      correct = multipleChoiceTask.options[selectedAnswer as number].isCorrect
    } else {
      const yesNoTask = task as YesNoTask
      correct = selectedAnswer === yesNoTask.solution.answer
    }
    
    setIsCorrect(correct)
  }, [task, selectedAnswer])

  const isValid = selectedAnswer !== null && (!validator || validator(selectedAnswer))

  return { selectedAnswer, isCorrect, handleAnswerSelect, handleAnswerSubmit, isValid }
} 