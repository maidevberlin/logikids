import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/card'
import { TaskLoadingProgress } from './TaskLoadingProgress'
import { TaskLoadingContent } from './TaskLoadingContent'
import { getSubjectTheme } from '@/app/common/subjectTheme'
import { cn } from '@/lib/utils'

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
  const { t } = useTranslation()
  const [progress, setProgress] = useState(0)
  const startTimeRef = useRef<number | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Get subject theme for icon and colors
  const theme = getSubjectTheme(subject)
  const SubjectIcon = theme.icon

  // Progress calculation effect
  // We manage progress state here and pass it to both sub-components
  useEffect(() => {
    // Record start time
    startTimeRef.current = Date.now()

    // Update progress every 200ms using non-linear easing
    intervalRef.current = setInterval(() => {
      if (startTimeRef.current === null) return

      const elapsed = Date.now() - startTimeRef.current

      /**
       * Non-linear easing function
       * Formula: progress = 100 * (1 - Math.exp(-elapsed / 7000))
       *
       * This creates a progress curve that:
       * - Reaches ~30% in first 3 seconds (feels responsive)
       * - Reaches ~63% at 7 seconds
       * - Reaches ~90% at 15 seconds
       * - Reaches ~95% at 20 seconds
       * - Asymptotically approaches 100% (never quite reaches it)
       */
      const newProgress = 100 * (1 - Math.exp(-elapsed / 7000))
      setProgress(Math.min(newProgress, 99.5)) // Cap at 99.5% to avoid "stuck at 100%"
    }, 200) // Update every 200ms for smooth animation

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return (
    <Card
      className={cn(
        'w-full max-w-2xl mx-auto',
        'p-6 sm:p-8',
        'space-y-6',
        className
      )}
      role="region"
      aria-label={t('loading.header')}
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
          {t('loading.header')}
        </h2>
      </div>

      {/* Progress bar section */}
      <div className="space-y-2">
        <TaskLoadingProgress subject={subject} />
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-700" />

      {/* Content section with stage message and carousel */}
      <TaskLoadingContent
        subject={subject}
        progress={progress}
      />
    </Card>
  )
}
