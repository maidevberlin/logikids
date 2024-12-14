import { useNavigate } from 'react-router-dom'
import { ErrorDisplay } from '../components/ErrorDisplay'
import { useArithmeticTask } from '../hooks/useTask'
import { useTaskHint } from '../hooks/useTaskHint'
import { useArithmeticAnswer } from '../hooks/useArithmeticAnswer'
import { TaskCard } from '../components/TaskCard'
import { TaskOptions } from '../components/TaskOptions/TaskOptions'
import { useState } from 'react'
import { Difficulty, Age } from '../types/task'
import { taskDefaults } from '../config'

export default function ArithmeticTaskPage() {
  const navigate = useNavigate()
  const [age, setAge] = useState<Age>(taskDefaults.age)
  const [difficulty, setDifficulty] = useState<Difficulty>(taskDefaults.difficulty)
  const { task, loading, error, refetch } = useArithmeticTask({age, difficulty})
  const { hint, requestHint } = useTaskHint('arithmetic', task)
  
  const {
    answer,
    selectedAnswer,
    isCorrect,
    handleAnswerChange,
    handleAnswerSubmit,
  } = useArithmeticAnswer()

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (task) {
      handleAnswerSubmit(task.solution)
    }
  }

  const handleNextTask = () => {
    refetch()
  }

  if (error) return <ErrorDisplay message={error} />

  return (
    <div className="space-y-4">
      <TaskOptions
        age={age}
        difficulty={difficulty}
        onAgeChange={setAge}
        onDifficultyChange={setDifficulty}
      />

      <TaskCard
        isLoading={loading}
        task={task}
        hint={hint}
        type="arithmetic"
        answer={answer}
        selectedAnswer={selectedAnswer}
        isCorrect={isCorrect}
        onAnswerChange={handleAnswerChange}
        onAnswerSubmit={handleSubmit}
        onRequestHint={requestHint}
        onNextTask={handleNextTask}
      />
    </div>
  )
} 