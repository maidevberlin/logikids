import { useCallback, useMemo, useEffect, useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useTask } from './useTask'
import { useUserData } from '@/app/account'
import { setData } from '@/data'
import { useProgress } from '@/app/stats'
import { getCurrentLanguage } from '@/i18n/config'
import { TaskRequest } from '@/api/logikids'
import { Difficulty } from './types'
import { PageLayout } from '@/app/common'
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskParams.subject, taskParams.concept])

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

  // Reset hints counter when task parameters change
  useEffect(() => {
    setHintsUsed(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskParams])

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    task,
    selectedAnswer,
    isCorrect,
    taskParams.subject,
    taskParams.difficulty,
    hintsUsed,
    // NOTE: updateStats intentionally omitted to prevent infinite loop
    // The callback uses the latest values via closure
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
    (newConcept: string, newSubject: string) => {
      if (newConcept && newSubject) {
        const params = new URLSearchParams(searchParams)
        navigate(
          `/subjects/${newSubject}/${newConcept}/tasks?${params.toString()}`
        )
      }
    },
    [navigate, searchParams]
  )

  const handleHintUsed = useCallback(() => {
    setHintsUsed((prev) => prev + 1)
  }, [])

  return (
    <>
      {/* Background pattern */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `url(${
            backgrounds[taskParams.subject as keyof typeof backgrounds]
          })`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      <PageLayout
        showBack
        showHome
        showGameStats
        showAccount
        headerCenter={
          <TaskPageHeader
            subject={taskParams.subject}
            concept={taskParams.concept}
            onSubjectChange={handleSubjectChange}
            onConceptChange={handleConceptChange}
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
            difficulty={taskParams.difficulty}
            onDifficultyChange={handleDifficultyChange}
          />
        </div>
      </PageLayout>
    </>
  )
}
