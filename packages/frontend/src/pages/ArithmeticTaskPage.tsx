import { useParams, useNavigate } from 'react-router-dom'
import { ArithmeticOperation } from '../../../backend/src/types/task'
import { ErrorDisplay } from '../components/ErrorDisplay'
import { useArithmeticTask } from '../hooks/useTask'
import { useArithmeticAnswer } from '../hooks/useArithmeticAnswer'
import { TaskCard } from '../components/TaskCard'

export default function ArithmeticTaskPage() {
  const navigate = useNavigate()
  const { operation } = useParams<{ operation?: ArithmeticOperation }>()
  const { task, hint, loading, error, requestHint } = useArithmeticTask(operation)
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
    navigate(0)
  }

  if (error) return <ErrorDisplay message={error} />

  return (
    <TaskCard
      isLoading={loading}
      task={task}
      hint={hint}
      type="arithmetic"
      operation={operation}
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