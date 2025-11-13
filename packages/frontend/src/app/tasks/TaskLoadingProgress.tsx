import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { getSubjectProgressGradient } from '@/app/common/subjectTheme'

/**
 * Props for the TaskLoadingProgress component
 */
export interface TaskLoadingProgressProps {
  /**
   * Subject identifier for theming (e.g., 'math', 'physics')
   */
  subject?: string

  /**
   * Optional controlled progress value (0-100)
   * If provided, component will not calculate its own progress
   */
  progress?: number

  /**
   * Additional CSS classes for the container
   */
  className?: string
}

/**
 * TaskLoadingProgress Component
 *
 * Displays an animated progress bar with time remaining estimate during task generation.
 * Uses non-linear easing function to make waiting feel faster while remaining honest.
 *
 * Features:
 * - Non-linear progress animation: progress = 100 * (1 - Math.exp(-elapsed / 7000))
 * - Subject-themed gradient colors
 * - Time remaining estimate
 * - Full accessibility support
 * - Responsive design
 * - Supports controlled progress mode (external progress value)
 *
 * @example
 * ```tsx
 * // Uncontrolled mode (internal progress calculation)
 * <TaskLoadingProgress subject="math" />
 *
 * // Controlled mode (external progress value)
 * <TaskLoadingProgress subject="math" progress={75} />
 * ```
 */
export function TaskLoadingProgress({
  subject,
  progress: externalProgress,
  className
}: TaskLoadingProgressProps) {
  const [internalProgress, setInternalProgress] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(20)
  const startTimeRef = useRef<number | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Use external progress if provided, otherwise use internal state
  const progress = externalProgress ?? internalProgress

  useEffect(() => {
    // Only run timer if not controlled by external progress
    if (externalProgress !== undefined) return

    // Record start time
    startTimeRef.current = Date.now()

    // Update progress every 200ms
    intervalRef.current = setInterval(() => {
      if (startTimeRef.current === null) return

      const elapsed = Date.now() - startTimeRef.current
      const elapsedSeconds = elapsed / 1000

      /**
       * Non-linear easing function
       * Formula: progress = 100 * (1 - Math.exp(-elapsed / 7000))
       *
       * Characteristics:
       * - ~30% in first 3 seconds (feels responsive)
       * - ~63% at 7 seconds
       * - ~90% at 15 seconds
       * - ~95% at 20 seconds
       * - Asymptotically approaches 100%
       */
      const newProgress = 100 * (1 - Math.exp(-elapsed / 7000))
      setInternalProgress(Math.min(newProgress, 99.5)) // Cap at 99.5% to avoid "stuck at 100%"

      /**
       * Time remaining estimate
       * Based on typical 20-second load time
       * Uses the inverse of the easing function to estimate remaining time
       */
      const estimatedTotalTime = 20 // seconds
      const remainingTime = Math.max(0, Math.ceil(estimatedTotalTime - elapsedSeconds))
      setTimeRemaining(remainingTime)
    }, 200) // Update every 200ms for smooth animation

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [externalProgress])

  // Get subject-specific gradient or default
  const gradient = getSubjectProgressGradient(subject || '')

  // Format time remaining text
  const timeText = timeRemaining > 0
    ? `About ${timeRemaining} second${timeRemaining !== 1 ? 's' : ''} remaining`
    : 'Almost there...'

  return (
    <div className={cn('w-full space-y-3', className)}>
      {/* Progress bar container */}
      <div
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Task generation progress"
        className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner"
      >
        {/* Progress bar fill with gradient */}
        <div
          className={cn(
            'h-full bg-gradient-to-r transition-all duration-200 ease-out',
            gradient,
            'relative overflow-hidden'
          )}
          style={{ width: `${progress}%` }}
        >
          {/* Subtle shine effect for activity indication */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
            style={{
              animation: 'shimmer 2s infinite',
            }}
          />
        </div>

        {/* Percentage label (overlay on progress bar) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold text-gray-700 drop-shadow-sm">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Time remaining estimate */}
      <div className="flex justify-end">
        <p
          className="text-sm text-muted-foreground"
          aria-live="polite"
          aria-atomic="true"
        >
          {timeText}
        </p>
      </div>

      {/* CSS animation for shimmer effect */}
      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        /* Respect reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .animate-shimmer {
            animation: none;
          }
          .transition-all {
            transition: none;
          }
        }
      `}</style>
    </div>
  )
}
