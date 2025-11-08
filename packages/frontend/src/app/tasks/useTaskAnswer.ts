import { useState, useCallback, useEffect } from 'react'
import { Task, SingleChoiceTask, YesNoTask, NumberInputTask, MultiSelectTask, OrderingTask, FillInBlankTask, TaskAnswerType } from './types'

interface UseTaskAnswerOptions<T extends Task> {
  task: T | undefined
  validator?: (value: TaskAnswerType<T>) => boolean
}

// Grading result for number_input tasks
export interface NumberInputGradingDetails {
  numberCorrect: boolean
  unitCorrect?: boolean  // undefined when no unit validation needed
}

export function useTaskAnswer<T extends Task>({ task, validator }: UseTaskAnswerOptions<T>) {
  const [selectedAnswer, setSelectedAnswer] = useState<TaskAnswerType<T> | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [gradingDetails, setGradingDetails] = useState<NumberInputGradingDetails | null>(null)

  // Reset state when task changes
  useEffect(() => {
    setSelectedAnswer(null)
    setIsCorrect(null)
    setGradingDetails(null)
  }, [task?.taskId])

  const handleAnswerSelect = useCallback((answer: TaskAnswerType<T> | null) => {
    // Don't allow changing answer if already correct
    if (isCorrect === true) {
      return
    }

    if (answer !== null && validator && !validator(answer)) {
      return
    }

    setSelectedAnswer(answer)
    setIsCorrect(null)
    setGradingDetails(null)
  }, [validator, isCorrect])

  const handleAnswerSubmit = useCallback(() => {
    if (!task || selectedAnswer === null) return

    let correct: boolean

    switch (task.type) {
      case 'single_choice': {
        const singleChoiceTask = task as SingleChoiceTask
        correct = singleChoiceTask.options[selectedAnswer as number].isCorrect
        break
      }
      case 'yes_no': {
        const yesNoTask = task as YesNoTask
        correct = selectedAnswer === yesNoTask.answer
        break
      }
      case 'number_input': {
        const numberInputTask = task as NumberInputTask
        const answer = selectedAnswer as { value: number | null; unit?: string }
        if (answer.value === null) {
          correct = false
          setGradingDetails(null)
        } else {
          // Exact match only (no tolerance)
          const numberCorrect = answer.value === numberInputTask.answer

          // Check unit if unitOptions present
          if (numberInputTask.unitOptions && numberInputTask.unitOptions.length > 0) {
            const unitCorrect = answer.unit === numberInputTask.unit
            correct = numberCorrect && unitCorrect
            setGradingDetails({ numberCorrect, unitCorrect })
          } else {
            correct = numberCorrect
            setGradingDetails({ numberCorrect, unitCorrect: undefined })
          }
        }
        break
      }
      case 'multi_select': {
        const multiSelectTask = task as MultiSelectTask
        const selectedIndices = selectedAnswer as number[]
        const correctIndices = multiSelectTask.options
          .map((opt, idx) => opt.isCorrect ? idx : -1)
          .filter(idx => idx !== -1)

        correct = selectedIndices.length === correctIndices.length &&
          selectedIndices.every(idx => correctIndices.includes(idx))
        break
      }
      case 'ordering': {
        const orderingTask = task as OrderingTask
        const selectedOrder = selectedAnswer as string[]
        correct = selectedOrder.length === orderingTask.correctOrder.length &&
          selectedOrder.every((id, idx) => id === orderingTask.correctOrder[idx])
        break
      }
      case 'fill_in_blank': {
        const fillInBlankTask = task as FillInBlankTask
        const answers = selectedAnswer as string[]
        correct = fillInBlankTask.blanks.every((blank, idx) => {
          const userAnswer = answers[idx]?.trim() || ''
          return blank.acceptedAnswers.some(accepted =>
            blank.caseSensitive
              ? userAnswer === accepted
              : userAnswer.toLowerCase() === accepted.toLowerCase()
          )
        })
        break
      }
      default:
        correct = false
    }

    setIsCorrect(correct)
  }, [task, selectedAnswer])

  const isValid = selectedAnswer !== null && (!validator || validator(selectedAnswer))

  return { selectedAnswer, isCorrect, gradingDetails, handleAnswerSelect, handleAnswerSubmit, isValid }
} 