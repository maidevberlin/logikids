import { useTask } from '../hooks/useTask'
import { useHint } from '../hooks/useTaskHint'
import { useArithmeticAnswer } from '../hooks/useArithmeticAnswer'
import { useSettings } from '../hooks/useSettings'
import { TaskCard } from '../components/TaskCard'
import { ErrorDisplay } from '../components/ErrorDisplay'
import { useSearchParams } from 'react-router-dom'
import { Difficulty } from '../types/task'
import { taskDefaults } from '../config'

export default function TaskPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { settings } = useSettings()
  const difficulty = (searchParams.get('difficulty') ?? taskDefaults.difficulty) as Difficulty
  const { task, loading, error, refetch } = useTask({ age: settings.age, difficulty })
  const { hint, requestHint } = useHint(task)
  
  console.log(settings);

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

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <ErrorDisplay message={error} onRetry={() => refetch()} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <TaskCard
        isLoading={loading}
        task={task}
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