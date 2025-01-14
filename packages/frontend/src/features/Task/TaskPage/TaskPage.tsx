import { useCallback, useMemo, useEffect, useState } from 'react'
import { useTask } from '../useTask'
import { useSettings } from '../../Account/Settings/useSettings'
import { useProgress } from '../../Stats/useProgress'
import { TaskCard } from '..'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Difficulty, Task } from '../types'
import { Breadcrumb } from '../../base/Breadcrumb/Breadcrumb'
import { cn } from '../../../utils'
import { styles as containerStyles } from '../../base/Layout/Container/styles'
import { Page } from '../../base/Layout'
import { styles } from './styles'
import type { TaskPageProps } from './types'
import { useLastTask } from '../useLastTask'

// Import background patterns
import mathBg from '../../../assets/math.webp'
import logicBg from '../../../assets/logic.webp'
import musicBg from '../../../assets/music.webp'
import defaultBg from '../../../assets/default.webp'
import { TaskRequest } from '../../../api/logikids'

const backgrounds = {
  math: mathBg,
  logic: logicBg,
  music: musicBg,
  physics: defaultBg, // Fallback to default pattern until physics pattern is available
  german: defaultBg // Fallback to default pattern until german pattern is available
} as const

const taskDefaults: TaskRequest = {
  difficulty: 'medium',
  subject: 'math',
  age: 10,
  concept: 'random'
}

export default function TaskPage({}: TaskPageProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const { settings } = useSettings()
  const { t } = useTranslation()
  const { updateStats } = useProgress()
  const [hintsUsed, setHintsUsed] = useState(0)
  const { storeLastTask } = useLastTask(taskDefaults)

  // Memoize task parameters
  const taskParams = useMemo(() => ({
    difficulty: (searchParams.get('difficulty') ?? taskDefaults.difficulty) as Difficulty,
    subject: (searchParams.get('subject') ?? taskDefaults.subject) as string,
    concept: (searchParams.get('concept') ?? taskDefaults.concept),
    age: settings.age
  }), [searchParams, settings.age])

  // Store subject and concept when they change
  useEffect(() => {
    storeLastTask(taskParams.subject, taskParams.concept)
  }, [taskParams.subject, taskParams.concept])
  
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
    if (task && selectedAnswer !== null && isCorrect !== null) {
      updateStats({
        subject: taskParams.subject,
        difficulty: taskParams.difficulty,
        correct: isCorrect,
        hintsUsed,
      })
    }
  }, [task, selectedAnswer, isCorrect, taskParams.subject, taskParams.difficulty, hintsUsed, updateStats])

  // Memoize handlers to prevent unnecessary re-renders
  const handleDifficultyChange = useCallback((newDifficulty: Difficulty) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev)
      newParams.set('difficulty', newDifficulty)
      return newParams
    })
  }, [setSearchParams])

  const handleSubjectChange = useCallback((newSubject: string) => {
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
    difficulty: taskParams.difficulty,
    subject: taskParams.subject,
    error,
    isCorrect,
    onAnswerSelect: selectAnswer,
    onAnswerSubmit: checkAnswer,
    onNextTask: nextTask,
    onDifficultyChange: handleDifficultyChange,
    onHintUsed: handleHintUsed,
  }), [
    isLoading,
    task,
    selectedAnswer,
    taskParams.difficulty,
    taskParams.subject,
    error,
    isCorrect,
    selectAnswer,
    checkAnswer,
    nextTask,
    handleDifficultyChange,
    handleHintUsed,
  ])

  const navigation = useMemo(() => (
    <Breadcrumb
      currentPage={t('task.title')}
      subject={taskParams.subject}
      concept={taskParams.concept}
      onSubjectChange={handleSubjectChange}
      onConceptChange={handleConceptChange}
    />
  ), [t, taskParams.subject, taskParams.concept, handleSubjectChange, handleConceptChange])

  return (
    <Page navigation={navigation}>
      <div className={cn(
        styles.container
      )}>
        <div 
          className={styles.pattern} 
          style={{ backgroundImage: `url(${backgrounds[taskParams.subject as keyof typeof backgrounds]})` }} 
        />
        <div className={cn(
          containerStyles.base,
          containerStyles.sizes.lg,
          styles.content
        )}>
          <TaskCard {...taskCardProps} />
        </div>
      </div>
    </Page>
  )
} 