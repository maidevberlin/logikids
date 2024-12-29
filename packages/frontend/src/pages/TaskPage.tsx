import { useTask } from '../hooks/useTask'
import { useSettings } from '../hooks/useSettings'
import { TaskCard } from '../components/TaskCard'
import { ErrorDisplay } from '../components/ErrorDisplay'
import { useSearchParams } from 'react-router-dom'
import { Difficulty, taskDefaults } from '../types/task'
import { useState } from 'react'

export default function TaskPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { settings } = useSettings()
  const difficulty = (searchParams.get('difficulty') ?? taskDefaults.difficulty) as Difficulty
  
  const { 
    task, 
    hint,
    isTaskLoading,
    taskError,
    refetch, 
    requestHint,
  } = useTask({ age: settings.age, difficulty, subject: 'math' })

  const [answer, setAnswer] = useState<number | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev)
      newParams.set('difficulty', newDifficulty)
      return newParams
    })
  }

  const handleAnswerChange = (newAnswer: number | null) => {
    setAnswer(newAnswer)
    setSelectedAnswer(newAnswer)
  }

  const handleSubmit = () => {
    if (!task) return
    const correct = answer === task.solution.index
    setIsCorrect(correct)
  }

  const handleNextTask = () => {
    setAnswer(null)
    setSelectedAnswer(null)
    setIsCorrect(null)
    refetch()
  }

  if (taskError) {
    return (
      <div className="flex items-center justify-center h-full">
        <ErrorDisplay message={taskError} onRetry={() => refetch()} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <TaskCard
        isLoading={isTaskLoading}
        task={task!}
        hint={hint}
        answer={answer}
        selectedAnswer={selectedAnswer}
        isCorrect={isCorrect}
        difficulty={difficulty}
        onAnswerChange={handleAnswerChange}
        onAnswerSubmit={handleSubmit}
        onRequestHint={requestHint}
        onNextTask={handleNextTask}
        onDifficultyChange={handleDifficultyChange}
      />
    </div>
  )
} 