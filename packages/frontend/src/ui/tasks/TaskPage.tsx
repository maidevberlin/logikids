import { useCallback, useMemo, useEffect, useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useTask } from '@/features/Task/useTask'
import { useUserData, setData } from '@/features/UserData'
import { useProgress } from '@/features/Stats/useProgress'
import { getCurrentLanguage } from '@/i18n/config'
import { TaskRequest } from '@/api/logikids'
import { Difficulty } from '@/features/Task/types'
import { PageLayout } from '@/ui/common'
import { TaskPageHeader } from './TaskPageHeader'
import { TaskCard } from './TaskCard'

// Import background patterns
import mathBg from '@/assets/math.webp'
import logicBg from '@/assets/logic.webp'
import musicBg from '@/assets/music.webp'
import defaultBg from '@/assets/default.webp'

const backgrounds = {
  math: mathBg,
  logic: logicBg,
  music: musicBg,
  physics: defaultBg,
  german: defaultBg,
} as const

const taskDefaults: TaskRequest = {
  difficulty: 'medium',
  subject: 'math',
  age: 10,
  grade: 5,
  language: 'en',
}

export default function TaskPage() {
  const { subject, concept } = useParams<{ subject: string; concept: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { data } = useUserData()
  const { updateStats } = useProgress()
  const [hintsUsed, setHintsUsed] = useState(0)

  // Memoize task parameters
  const taskParams = useMemo(() => {
    return {
      difficulty: (searchParams.get('difficulty') ??
        taskDefaults.difficulty) as Difficulty,
      subject: subject ?? taskDefaults.subject,
      concept: concept && concept !== 'random' ? concept : undefined,
      age: data?.settings.age ?? taskDefaults.age,
      grade: data?.settings.grade ?? taskDefaults.grade,
      language: getCurrentLanguage(),
      gender: data?.settings.gender as
        | 'male'
        | 'female'
        | 'non-binary'
        | 'prefer-not-to-say'
        | undefined,
    }
  }, [
    subject,
    concept,
    searchParams,
    data?.settings.age,
    data?.settings.grade,
    data?.settings.gender,
  ])

  // Store subject and concept when they change
  useEffect(() => {
    if (data) {
      setData({
        lastTask: { subject: taskParams.subject, concept: taskParams.concept },
      })
    }
  }, [taskParams.subject, taskParams.concept, data])

  const {
    task,
    isLoading,
    error,
    selectedAnswer,
    isCorrect,
    checkAnswer,
    selectAnswer,
    nextTask,
    hints,
    requestHint,
    hintLoading,
    hintError,
    canRequestHint,
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
  }, [
    task,
    selectedAnswer,
    isCorrect,
    taskParams.subject,
    taskParams.difficulty,
    hintsUsed,
    updateStats,
  ])

  // Handlers
  const handleDifficultyChange = useCallback(
    (newDifficulty: Difficulty) => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev)
        newParams.set('difficulty', newDifficulty)
        return newParams
      })
    },
    [setSearchParams]
  )

  const handleSubjectChange = useCallback(
    (newSubject: string) => {
      navigate(`/subjects/${newSubject}`)
    },
    [navigate]
  )

  const handleConceptChange = useCallback(
    (newConcept: string) => {
      if (newConcept && taskParams.subject) {
        const params = new URLSearchParams(searchParams)
        navigate(
          `/subjects/${taskParams.subject}/${newConcept}/tasks?${params.toString()}`
        )
      }
    },
    [navigate, taskParams.subject, searchParams]
  )

  const handleHintUsed = useCallback(() => {
    setHintsUsed((prev) => prev + 1)
  }, [])

  return (
    <>
      {/* Background pattern */}
      <div
        className="fixed inset-0 opacity-10 pointer-events-none z-0"
        style={{
          backgroundImage: `url(${
            backgrounds[taskParams.subject as keyof typeof backgrounds]
          })`,
          backgroundSize: '400px',
          backgroundRepeat: 'repeat',
        }}
      />

      <PageLayout
        showBack
        showAccount
        headerCenter={
          <TaskPageHeader
            subject={taskParams.subject}
            concept={taskParams.concept}
            difficulty={taskParams.difficulty}
            onSubjectChange={handleSubjectChange}
            onConceptChange={handleConceptChange}
            onDifficultyChange={handleDifficultyChange}
          />
        }
      >
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Task Card */}
          <TaskCard
            task={task ?? null}
            isLoading={isLoading}
            error={error}
            selectedAnswer={selectedAnswer}
            isCorrect={isCorrect}
            onAnswerSelect={selectAnswer}
            onAnswerSubmit={checkAnswer}
            onNextTask={nextTask}
            hints={hints}
            requestHint={requestHint}
            hintLoading={hintLoading}
            hintError={hintError}
            canRequestHint={canRequestHint}
            onHintUsed={handleHintUsed}
          />
        </div>
      </PageLayout>
    </>
  )
}
