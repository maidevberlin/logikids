import { useCallback, useMemo, useEffect, useState } from 'react'
import { useTask } from '../hooks/useTask'
import { useSettings } from '../hooks/useSettings'
import { useProgress } from '../hooks/useProgress'
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
  const { updateStats } = useProgress()
  const [hintsUsed, setHintsUsed] = useState(0)
  
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

  // Reset answer and hints when task parameters change
  useEffect(() => {
    selectAnswer(null)
    setHintsUsed(0)
  }, [taskParams, selectAnswer])

  // Track progress when answer is checked
  useEffect(() => {
    if (isCorrect !== null) {
      updateStats({
        subject: taskParams.subject,
        difficulty: taskParams.difficulty,
        correct: isCorrect,
        hintsUsed,
      })
    }
  }, [isCorrect, taskParams.subject, taskParams.difficulty, hintsUsed, updateStats])

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

  const handleHintUsed = useCallback(() => {
    setHintsUsed(prev => prev + 1)
  }, [])

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
    onHintUsed: handleHintUsed,
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
    handleHintUsed,
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