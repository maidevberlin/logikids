import { useParams, useNavigate } from 'react-router-dom'
import { GeometryOperation } from '../../../backend/src/types/task'
import { ErrorDisplay } from '../components/ErrorDisplay'
import { useGeometryTask } from '../hooks/useTask'
import { TaskCard } from '../components/TaskCard'

export default function GeometryTaskPage() {
  const navigate = useNavigate()
  const { operation } = useParams<{ operation?: GeometryOperation }>()
  const { task, hint, loading, error, requestHint } = useGeometryTask(operation as GeometryOperation)

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
      operation={operation}
      onRequestHint={requestHint}
      onNextTask={handleNextTask}
    />
  )
} 