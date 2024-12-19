import { useState } from 'react'
import { ErrorDisplay } from '../components/ErrorDisplay'
import { useArithmeticTask } from '../hooks/useTask'
import { useTaskHint } from '../hooks/useTaskHint'
import { useArithmeticAnswer } from '../hooks/useArithmeticAnswer'
import { useSettings } from '../hooks/useSettings'
import { TaskCard } from '../components/TaskCard'
import { SettingsButton } from '../components/Settings/SettingsButton'
import { SettingsModal } from '../components/Settings/SettingsModal'
import { useSearchParams } from 'react-router-dom'
import { Difficulty } from '../types/task'
import { taskDefaults } from '../config'

export default function ArithmeticTaskPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const { settings, updateAge, updateName } = useSettings()
  const difficulty = (searchParams.get('difficulty') ?? taskDefaults.difficulty) as Difficulty
  
  const { task, loading, error, refetch } = useArithmeticTask({ age: settings.age, difficulty })
  const { hint, requestHint } = useTaskHint('arithmetic', task)
  
  const {
    answer,
    selectedAnswer,
    isCorrect,
    handleAnswerChange,
    handleAnswerSubmit,
    reset,
  } = useArithmeticAnswer()

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev)
      newParams.set('difficulty', newDifficulty)
      return newParams
    })
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (task) {
      handleAnswerSubmit(task.solution)
    }
  }

  const handleNextTask = () => {
    reset()
    refetch()
  }

  if (error) return <ErrorDisplay message={error} />

  return (
    <div className="space-y-4">
      <SettingsButton onClick={() => setIsSettingsOpen(true)} />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        age={settings.age}
        name={settings.name}
        onAgeChange={updateAge}
        onNameChange={updateName}
      />

      <TaskCard
        isLoading={loading}
        task={task}
        hint={hint}
        type="arithmetic"
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