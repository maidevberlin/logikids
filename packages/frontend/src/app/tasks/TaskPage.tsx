import { useCallback, useMemo, useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useTask } from './useTask'
import { useUserData } from '@/app/user'
import { setData } from '@/app/user/storage'
import { useProgress } from '@/app/progress'
import { getCurrentLanguage } from '@/i18n.ts'
import { TaskRequest } from './types'
import { Difficulty } from './types'
import { PageLayout } from '@/app/common/PageLayout'
import { TaskPageHeader } from './TaskPageHeader'
import { TaskCard } from './TaskCard'
import { useDifficultyTracking } from '@/app/progress'
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
  grade: 5,
  language: 'en',
}

export function TaskPage() {
  const { subject, concept } = useParams<{ subject: string; concept: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { data } = useUserData()
  const { submitTaskAttempt } = useProgress()

  // Adaptive difficulty tracking
  const {
    currentDifficulty,
    notification,
    checkAndAdjustDifficulty,
    dismissNotification,
    setDifficulty,
  } = useDifficultyTracking(subject || 'math', concept || 'random')

  // Local difficulty for current task - only updates on explicit user actions (next task, manual change)
  // This prevents the task from refetching when adaptive difficulty changes mid-task
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty>(currentDifficulty)

  // Track which task we've already submitted an attempt for (to avoid counting multiple wrong answers)
  const [submittedTaskId, setSubmittedTaskId] = useState<string | null>(null)

  // Sync activeDifficulty when currentDifficulty changes on initial load or concept change
  useEffect(() => {
    setActiveDifficulty(currentDifficulty)
  }, [subject, concept]) // Only on subject/concept change, not on every currentDifficulty change

  // Memoize task parameters
  const taskParams = useMemo(() => {
    return {
      difficulty: activeDifficulty,
      subject: subject ?? taskDefaults.subject,
      concept: concept && concept !== 'random' ? concept : undefined,
      grade: data?.settings.grade ?? taskDefaults.grade,
      language: getCurrentLanguage(),
    }
  }, [subject, concept, activeDifficulty, data?.settings.grade])

  // Store subject and concept when they change
  useEffect(() => {
    if (data) {
      setData({
        lastTask: { subject: taskParams.subject, concept: taskParams.concept },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskParams.subject, taskParams.concept])

  // Callback to record hint costs
  const handleHintReceived = useCallback(
    (usage?: { inputTokens: number; outputTokens: number; totalTokens: number; cost?: number }) => {
      if (usage && data) {
        const currentCosts = data.costs || []
        setData({
          costs: [
            ...currentCosts,
            {
              subject: taskParams.subject,
              concept: taskParams.concept || 'random',
              inputTokens: usage.inputTokens,
              outputTokens: usage.outputTokens,
              totalTokens: usage.totalTokens,
              cost: usage.cost,
              timestamp: Date.now(),
            },
          ],
        })
      }
    },
    [data, taskParams.subject, taskParams.concept]
  )

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
    totalHintUsage,
  } = useTask(taskParams, { onHintReceived: handleHintReceived })

  // Track progress when answer is checked (only once per task)
  useEffect(() => {
    if (task && selectedAnswer !== null && isCorrect !== null && submittedTaskId !== task.taskId) {
      // Mark this task as submitted
      setSubmittedTaskId(task.taskId)

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
              totalTokens:
                task.usage.totalTokens || task.usage.inputTokens + task.usage.outputTokens,
              cost: task.usage.cost,
              timestamp: Date.now(),
            },
          ],
        })
      }

      // Check and adjust difficulty after recording attempt
      checkAndAdjustDifficulty()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task?.taskId, isCorrect])

  // Handlers
  const handleNextTask = useCallback(() => {
    // Record skip if task exists and no answer was submitted (isCorrect is still null)
    if (task && isCorrect === null) {
      submitTaskAttempt({
        subject: taskParams.subject,
        conceptId: taskParams.concept || 'random',
        difficulty: taskParams.difficulty,
        correct: null,
        hintsUsed,
        startTime,
        skipped: true,
      })
    }
    // Apply any pending difficulty change from adaptive tracking
    setActiveDifficulty(currentDifficulty)
    nextTask()
  }, [
    task,
    isCorrect,
    taskParams.subject,
    taskParams.concept,
    taskParams.difficulty,
    hintsUsed,
    startTime,
    submitTaskAttempt,
    currentDifficulty,
    nextTask,
  ])

  const handleDifficultyChange = useCallback(
    (newDifficulty: Difficulty) => {
      setDifficulty(newDifficulty)
      setActiveDifficulty(newDifficulty) // Apply immediately for manual changes
    },
    [setDifficulty]
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
            onNextTask={handleNextTask}
            hints={hints}
            requestHint={requestHint}
            hintLoading={hintLoading}
            hintError={hintError}
            canRequestHint={canRequestHint}
            difficulty={taskParams.difficulty}
            onDifficultyChange={handleDifficultyChange}
            hintUsage={totalHintUsage}
          />
        </div>
      </PageLayout>
    </>
  )
}
