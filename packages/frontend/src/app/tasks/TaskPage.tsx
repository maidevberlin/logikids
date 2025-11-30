import { useCallback, useMemo, useEffect, useRef } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useTask } from './useTask'
import { useUserData } from '@/app/account'
import { setData } from '@/data'
import { useProgress } from '@/data/progress/hooks'
import { getCurrentLanguage } from '@/i18n/config'
import { TaskRequest } from '@/api/logikids'
import { Difficulty } from './types'
import { PageLayout } from '@/app/common/PageLayout'
import { TaskPageHeader } from './TaskPageHeader'
import { TaskCard } from './TaskCard'
import { useDifficultyTracking } from '@/hooks/useDifficultyTracking'
import { DifficultyBanner } from '@/app/common/DifficultyBanner.tsx'

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

export function TaskPage() {
  const { subject, concept } = useParams<{ subject: string; concept: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { data } = useUserData()
  const { submitTaskAttempt } = useProgress()

  // Adaptive difficulty tracking
  const { currentDifficulty, notification, checkAndAdjustDifficulty, dismissNotification } =
    useDifficultyTracking(subject || 'math', concept || 'random')

  // Track if current task was answered (to detect skips)
  const taskAnsweredRef = useRef(false)
  const previousTaskIdRef = useRef<string | null>(null)

  // Memoize task parameters
  const taskParams = useMemo(() => {
    return {
      difficulty: currentDifficulty,
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
    currentDifficulty,
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
    gradingDetails,
    checkAnswer,
    selectAnswer,
    nextTask,
    hints,
    hintsUsed,
    requestHint,
    hintLoading,
    hintError,
    canRequestHint,
    startTime,
  } = useTask(taskParams)

  // Track progress when answer is checked
  useEffect(() => {
    if (task && selectedAnswer !== null && isCorrect !== null) {
      taskAnsweredRef.current = true
      submitTaskAttempt({
        subject: taskParams.subject,
        conceptId: taskParams.concept || 'random',
        difficulty: taskParams.difficulty,
        correct: isCorrect,
        hintsUsed,
        startTime,
        skipped: false,
      })

      // Save task costs if available
      if (task.usage && data) {
        const currentCosts = data.costs || []
        setData({
          costs: [
            ...currentCosts,
            {
              subject: taskParams.subject,
              concept: taskParams.concept || 'random',
              inputTokens: task.usage.inputTokens,
              outputTokens: task.usage.outputTokens,
              totalTokens: task.usage.totalTokens,
              timestamp: Date.now(),
            },
          ],
        })
      }

      // Check and adjust difficulty after recording attempt
      checkAndAdjustDifficulty()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    task,
    selectedAnswer,
    isCorrect,
    taskParams.subject,
    taskParams.concept,
    taskParams.difficulty,
    hintsUsed,
    startTime,
    // NOTE: submitTaskAttempt and checkAndAdjustDifficulty intentionally omitted to prevent infinite loop
    // The callbacks use the latest values via closure
  ])

  // Track skips when task changes
  useEffect(() => {
    if (!task) return

    // If task changed and previous task wasn't answered, record skip
    if (
      previousTaskIdRef.current &&
      previousTaskIdRef.current !== task.taskId &&
      !taskAnsweredRef.current
    ) {
      submitTaskAttempt({
        subject: taskParams.subject,
        conceptId: taskParams.concept || 'random',
        difficulty: taskParams.difficulty,
        correct: null,
        hintsUsed,
        startTime,
        skipped: true,
      })
      // Check and adjust difficulty after recording skip
      checkAndAdjustDifficulty()
    }

    // Update refs for next task
    previousTaskIdRef.current = task.taskId
    taskAnsweredRef.current = false
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task?.taskId])

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

  const handleConceptChange = useCallback(
    (newConcept: string, newSubject: string) => {
      if (newConcept && newSubject) {
        const params = new URLSearchParams(searchParams)
        navigate(`/subjects/${newSubject}/${newConcept}/tasks?${params.toString()}`)
      }
    },
    [navigate, searchParams]
  )

  return (
    <>
      {/* Difficulty Notification Banner */}
      <DifficultyBanner notification={notification} onDismiss={dismissNotification} />

      {/* Background pattern */}
      <div
        className="fixed inset-0 pointer-events-none z-0 task-background"
        style={{
          backgroundImage: `url(${backgrounds[taskParams.subject as keyof typeof backgrounds]})`,
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
            subject={taskParams.subject}
            selectedAnswer={selectedAnswer}
            isCorrect={isCorrect}
            gradingDetails={gradingDetails}
            onAnswerSelect={selectAnswer}
            onAnswerSubmit={checkAnswer}
            onNextTask={nextTask}
            hints={hints}
            requestHint={requestHint}
            hintLoading={hintLoading}
            hintError={hintError}
            canRequestHint={canRequestHint}
            difficulty={taskParams.difficulty}
            onDifficultyChange={handleDifficultyChange}
          />
        </div>
      </PageLayout>
    </>
  )
}
