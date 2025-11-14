import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/card'
import { TaskLoadingProgress } from './TaskLoadingProgress'
import { TaskLoadingContent } from './TaskLoadingContent'
import { getSubjectTheme } from '@/app/common/subjectTheme'
import { cn } from '@/lib/utils'
import { useTaskLoadingCalibration } from '@/hooks/useTaskLoadingCalibration'

/**
 * Props for the TaskLoadingState component
 */
export interface TaskLoadingStateProps {
  /**
   * Subject identifier for theming and content selection (e.g., 'math', 'physics')
   */
  subject: string

  /**
   * Additional CSS classes for the container
   */
  className?: string
}

/**
 * TaskLoadingState Component
 *
 * Integrated loading experience that combines progress indication with educational content.
 * Displays a subject-themed header, animated progress bar with time estimates, stage-based
 * messages, and rotating educational content to keep users engaged during task generation.
 *
 * Features:
 * - Subject-themed header with icon
 * - Shared progress state between sub-components
 * - Non-linear progress animation
 * - Rotating educational content (tips, facts, previews, encouragement)
 * - Stage-based status messages
 * - Full accessibility support
 * - Mobile responsive design
 *
 * Component Structure:
 * ```
 * TaskLoadingState
 * ├── Header (subject icon + title)
 * ├── TaskLoadingProgress (progress bar + time estimate)
 * └── TaskLoadingContent (stage message + content carousel)
 * ```
 *
 * @example
 * ```tsx
 * <TaskLoadingState subject="math" />
 * ```
 */
export function TaskLoadingState({
  subject,
  className
}: TaskLoadingStateProps) {
  const { t } = useTranslation('loading')
  const [progress, setProgress] = useState(0)
  const startTimeRef = useRef<number | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [showAlmostThere, setShowAlmostThere] = useState(false)
  const almostThereTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Get calibration utilities
  const { getTimeConstant } = useTaskLoadingCalibration()

  // Get subject theme for icon and colors
  const theme = getSubjectTheme(subject)
  const SubjectIcon = theme.icon

  // Progress calculation effect with calibration
  // We manage progress state here and pass it to both sub-components
  useEffect(() => {
    // Record start time
    startTimeRef.current = Date.now()

    // Get calibrated time constant (default 7000ms, adjusted based on history)
    const timeConstant = getTimeConstant()

    // Update progress every 200ms using non-linear easing
    intervalRef.current = setInterval(() => {
      if (startTimeRef.current === null) return

      const elapsed = Date.now() - startTimeRef.current

      /**
       * Non-linear easing function with calibrated time constant
       * Formula: progress = 100 * (1 - Math.exp(-elapsed / timeConstant))
       *
       * The timeConstant is calibrated based on user's historical load times:
       * - New users: 7000ms (default)
       * - After usage: Adjusted to match actual average load time
       * - Bounds: 3000ms - 15000ms (prevents extreme behavior)
       *
       * Progress curve characteristics:
       * - Reaches ~30% in first 3 seconds (feels responsive)
       * - Reaches ~63% at timeConstant milliseconds
       * - Reaches ~90% at ~2.3 * timeConstant
       * - Asymptotically approaches 100% (never quite reaches it)
       */
      const newProgress = 100 * (1 - Math.exp(-elapsed / timeConstant))
      setProgress(Math.min(newProgress, 99.5)) // Cap at 99.5% to avoid "stuck at 100%"
    }, 200) // Update every 200ms for smooth animation

    // Show "Almost there..." message after 30 seconds
    almostThereTimeoutRef.current = setTimeout(() => {
      setShowAlmostThere(true)
    }, 30000)

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (almostThereTimeoutRef.current) {
        clearTimeout(almostThereTimeoutRef.current)
      }
      // Note: Load time recording is handled in TaskCard component
      // which has access to the actual task loading state transitions
    }
  }, [getTimeConstant])

  return (
    <Card
      className={cn(
        'w-full max-w-2xl mx-auto',
        'p-6 sm:p-8',
        'space-y-6',
        className
      )}
      role="region"
      aria-label={t('header', 'Preparing your task...')}
      aria-live="polite"
      aria-busy="true"
    >
      {/* Header with subject icon and title */}
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex-shrink-0 p-2 rounded-lg',
            theme.colors.bgLight
          )}
          aria-hidden="true"
        >
          <SubjectIcon
            className={cn('w-6 h-6', theme.colors.text)}
          />
        </div>
        <h2 className="text-lg sm:text-xl font-semibold text-foreground">
          {t('header', 'Preparing your task...')}
        </h2>
      </div>

      {/* Progress bar section */}
      <div className="space-y-2">
        <TaskLoadingProgress subject={subject} progress={progress} />
      </div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Content section with stage message and carousel */}
      <TaskLoadingContent
        subject={subject}
        progress={progress}
      />

      {/* "Almost there" message for long load times (> 30s) */}
      {showAlmostThere && (
        <div className="text-center text-sm text-muted-foreground animate-in fade-in">
          {t('almostThere', 'Almost there... generating a great question for you!')}
        </div>
      )}
    </Card>
  )
}
