import { useCallback, useMemo, useEffect } from 'react'
import { useTask } from '../hooks/useTask'
import { useSettings } from '../hooks/useSettings'
import { TaskCard } from '../components/TaskCard'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Difficulty, Subject, taskDefaults, Task } from '../types/task'
import { Breadcrumb } from '../components/base/Breadcrumb/Breadcrumb'
import { cn } from '../components/base/styles/utils'
import { container, background } from '../components/base/styles/common'

export default function TaskPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { settings } = useSettings()
  const { t } = useTranslation()
  
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

  // Reset answer when task parameters change
  useEffect(() => {
    selectAnswer(null)
  }, [taskParams, selectAnswer])

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
    error,
    onAnswerSelect: selectAnswer,
    onAnswerSubmit: checkAnswer,
    onNextTask: nextTask,
    onDifficultyChange: handleDifficultyChange,
  }), [
    isLoading,
    task,
    selectedAnswer,
    isCorrect,
    taskParams.difficulty,
    error,
    selectAnswer,
    checkAnswer,
    nextTask,
    handleDifficultyChange,
  ])

  return (
    <>
      <Breadcrumb 
        currentPage={t('task.title')} 
        subject={taskParams.subject}
        onSubjectChange={handleSubjectChange}
      />
      <div className={cn(
        'min-h-screen py-12',
        background.solid.gray
      )}>
        <div className={cn(
          container.base,
          container.maxWidth.lg,
          'p-8'
        )}>
          <TaskCard {...taskCardProps} />
        </div>
      </div>
    </>
  )
} 