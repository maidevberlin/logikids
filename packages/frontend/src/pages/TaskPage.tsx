import { useCallback, useMemo } from 'react'
import { useTask } from '../hooks/useTask'
import { useSettings } from '../hooks/useSettings'
import { TaskCard } from '../components/TaskCard'
import { useSearchParams } from 'react-router-dom'
import { Difficulty, Subject, taskDefaults, Task } from '../types/task'

export default function TaskPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { settings } = useSettings()
  
  // Memoize task parameters
  const taskParams = useMemo(() => ({
    difficulty: (searchParams.get('difficulty') ?? taskDefaults.difficulty) as Difficulty,
    subject: (searchParams.get('subject') ?? taskDefaults.subject) as Subject,
    age: settings.age
  }), [searchParams, settings.age])
  
  const { 
    task, 
    isLoading,
    error,
    selectedAnswer,
    isCorrect,
    checkAnswer,
    selectAnswer,
    nextTask
  } = useTask(taskParams)

  // Memoize handlers to prevent unnecessary re-renders
  const handleDifficultyChange = useCallback((newDifficulty: Difficulty) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev)
      newParams.set('difficulty', newDifficulty)
      return newParams
    })
  }, [setSearchParams])

  const handleSubjectChange = useCallback((newSubject: Subject) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev)
      newParams.set('subject', newSubject)
      return newParams
    })
  }, [setSearchParams])

  // Memoize TaskCard props to prevent unnecessary re-renders
  const taskCardProps = useMemo(() => ({
    isLoading,
    task: task ?? {} as Task,
    selectedAnswer,
    isCorrect,
    difficulty: taskParams.difficulty,
    subject: taskParams.subject,
    error,
    onAnswerSelect: selectAnswer,
    onAnswerSubmit: checkAnswer,
    onNextTask: nextTask,
    onDifficultyChange: handleDifficultyChange,
    onSubjectChange: handleSubjectChange
  }), [
    isLoading,
    task,
    selectedAnswer,
    isCorrect,
    taskParams.difficulty,
    taskParams.subject,
    error,
    selectAnswer,
    checkAnswer,
    nextTask,
    handleDifficultyChange,
    handleSubjectChange
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <TaskCard {...taskCardProps} />
      </div>
    </div>
  )
} 