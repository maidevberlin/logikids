import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * Subject color mappings for progress bar gradients
 * Matches the color scheme from subjectTheme.ts
 */
const subjectGradients: Record<string, string> = {
  math: 'from-blue-400 via-blue-500 to-blue-600',
  logic: 'from-purple-400 via-purple-500 to-purple-600',
  physics: 'from-emerald-400 via-emerald-500 to-emerald-600',
  german: 'from-red-400 via-red-500 to-red-600',
  english: 'from-amber-400 via-amber-500 to-amber-600',
  music: 'from-pink-400 via-pink-500 to-pink-600',
}

const defaultGradient = 'from-gray-400 via-gray-500 to-gray-600'

/**
 * Props for the TaskLoadingProgress component
 */
export interface TaskLoadingProgressProps {
  /**
   * Subject identifier for theming (e.g., 'math', 'physics')
   */
  subject?: string

  /**
   * Callback invoked when progress reaches 100%
   * Note: This is called when the animation completes, not when the actual task loads
   */
  onComplete?: () => void

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
 *
 * @example
 * ```tsx
 * <TaskLoadingProgress
 *   subject="math"
 *   onComplete={() => console.log('Animation complete')}
 * />
 * ```
 */
export function TaskLoadingProgress({
  subject,
  onComplete,
  className
}: TaskLoadingProgressProps) {
  const [progress, setProgress] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(20)
  const startTimeRef = useRef<number | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
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
      setProgress(Math.min(newProgress, 99.5)) // Cap at 99.5% to avoid "stuck at 100%"

      /**
       * Time remaining estimate
       * Based on typical 20-second load time
       * Uses the inverse of the easing function to estimate remaining time
       */
      const estimatedTotalTime = 20 // seconds
      const remainingTime = Math.max(0, Math.ceil(estimatedTotalTime - elapsedSeconds))
      setTimeRemaining(remainingTime)

      // Call onComplete when progress reaches ~99% (implies animation is nearly done)
      if (newProgress >= 99 && onComplete) {
        onComplete()
      }
    }, 200) // Update every 200ms for smooth animation

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [onComplete])

  // Get subject-specific gradient or default
  const gradient = subject ? (subjectGradients[subject] || defaultGradient) : defaultGradient

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
