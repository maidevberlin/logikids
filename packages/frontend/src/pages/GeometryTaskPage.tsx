import { useNavigate } from 'react-router-dom'
import { ErrorDisplay } from '../components/ErrorDisplay'
import { useGeometryTask } from '../hooks/useTask'
import { useTaskAnswer } from '../hooks/useTaskAnswer'
import { TaskCard } from '../components/TaskCard'

export default function GeometryTaskPage() {
  const navigate = useNavigate()
  const { task, hint, loading, error, requestHint } = useGeometryTask()
  const {
    answer,
    selectedAnswer,
    isCorrect,
    handleAnswerChange,
    handleAnswerSubmit,
  } = useTaskAnswer({ type: 'geometry' })

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (task) {
      handleAnswerSubmit(task.solution)
    }
  }

  const handleNextTask = () => {
    navigate(0)
  }

  if (error) return <ErrorDisplay message={error} />

  return (
    <TaskCard
      isLoading={loading}
      task={task}
      hint={hint}
      type="geometry"
      answer={answer}
      selectedAnswer={selectedAnswer}
      isCorrect={isCorrect}
      onAnswerChange={handleAnswerChange}
      onAnswerSubmit={handleSubmit}
      onRequestHint={requestHint}
      onNextTask={handleNextTask}
    />
  )
} 