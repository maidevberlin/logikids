import { useCallback, useMemo, useEffect, useState } from 'react'
import { useTask } from '../hooks/useTask'
import { useSettings } from '../hooks/useSettings'
import { useProgress } from '../hooks/useProgress'
import { TaskCard } from '../components/TaskCard'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Task, TaskRequest, Subject, Difficulty } from '@logikids/backend/tasks/types'
import { Breadcrumb } from '../components/base/Breadcrumb/Breadcrumb'
import { cn } from '../components/base/styles/utils'
import { container } from '../components/base/styles/common'
import { Page } from '../components/base/layout/Page'

const taskDefaults: TaskRequest = {
  difficulty: 'medium',
  subject: 'math',
  age: 10,
  concept: 'random'
};

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
    concept: (searchParams.get('concept') ?? taskDefaults.concept),
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
      // Reset concept when subject changes
      newParams.set('concept', 'random')
      return newParams
    })
  }, [setSearchParams])

  const handleConceptChange = useCallback((newConcept: string) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev)
      // Ensure both subject and concept are set
      newParams.set('subject', taskParams.subject)
      newParams.set('concept', newConcept)
      return newParams
    })
  }, [setSearchParams, taskParams.subject])

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
    <Page>
      <Breadcrumb 
        currentPage={t('task.title')} 
        subject={taskParams.subject}
        concept={taskParams.concept}
        onSubjectChange={handleSubjectChange}
        onConceptChange={handleConceptChange}
      />
      <div className="py-8">
        <div className={cn(
          container.base,
          container.maxWidth.lg,
          'px-4'
        )}>
          <TaskCard {...taskCardProps} />
        </div>
      </div>
    </Page>
  )
} 