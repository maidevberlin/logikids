import { ErrorDisplay } from '../components/ErrorDisplay'
import { useArithmeticTask } from '../hooks/useTask'
import { useTaskHint } from '../hooks/useTaskHint'
import { useArithmeticAnswer } from '../hooks/useArithmeticAnswer'
import { TaskCard } from '../components/TaskCard'
import { TaskOptions } from '../components/TaskOptions/TaskOptions'
import { useSearchParams } from 'react-router-dom'
import { Difficulty, Age } from '../types/task'
import { taskDefaults } from '../config'

export default function ArithmeticTaskPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const age = Number(searchParams.get('age') ?? taskDefaults.age) as Age
  const difficulty = (searchParams.get('difficulty') ?? taskDefaults.difficulty) as Difficulty
  
  const { task, loading, error, refetch } = useArithmeticTask({age, difficulty})
  const { hint, requestHint } = useTaskHint('arithmetic', task)
  
  const {
    answer,
    selectedAnswer,
    isCorrect,
    handleAnswerChange,
    handleAnswerSubmit,
    reset,
  } = useArithmeticAnswer()

  const handleAgeChange = (newAge: Age) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev)
      newParams.set('age', String(newAge))
      return newParams
    })
  }

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
      <TaskOptions
        age={age}
        difficulty={difficulty}
        onAgeChange={handleAgeChange}
        onDifficultyChange={handleDifficultyChange}
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