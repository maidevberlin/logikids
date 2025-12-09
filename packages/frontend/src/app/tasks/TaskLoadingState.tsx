import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/app/common/ui/card'
import { TaskLoadingContent } from './TaskLoadingContent'
import { getSubjectTheme } from '@/app/common/subjectTheme'
import { cn } from '@/lib/utils'
import { useTaskLoadingCalibration } from '@/hooks/useTaskLoadingCalibration'
import { Brain, Wand2, Sparkles, CheckCircle2 } from 'lucide-react'

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
 * Phase configuration for loading animation
 */
interface PhaseConfig {
  icon: typeof Brain
  animation: 'pulse' | 'rotate' | 'twinkle' | 'scale'
  label: string
}

/**
 * Get phase configuration based on progress
 */
function getPhaseConfig(progress: number, t: (key: string) => string): PhaseConfig {
  if (progress < 25) {
    return {
      icon: Brain,
      animation: 'pulse',
      label: t('stages.analyzing'),
    }
  } else if (progress < 50) {
    return {
      icon: Wand2,
      animation: 'rotate',
      label: t('stages.crafting'),
    }
  } else if (progress < 80) {
    return {
      icon: Sparkles,
      animation: 'twinkle',
      label: t('stages.generating'),
    }
  } else {
    return {
      icon: CheckCircle2,
      animation: 'scale',
      label: t('stages.finalizing'),
    }
  }
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
export function TaskLoadingState({ subject, className }: TaskLoadingStateProps) {
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

  // Get current phase configuration
  const phaseConfig = getPhaseConfig(progress, t)
  const PhaseIcon = phaseConfig.icon

  // Get animation class based on phase
  const getAnimationClass = (animation: PhaseConfig['animation']) => {
    switch (animation) {
      case 'pulse':
        return 'animate-pulse-slow'
      case 'rotate':
        return 'animate-spin-slow'
      case 'twinkle':
        return 'animate-twinkle'
      case 'scale':
        return 'animate-scale-pulse'
    }
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Thin progress bar at top - Google style */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-transparent z-50">
        <div
          className={cn('h-full transition-all duration-300 ease-out', theme.colors.bg)}
          style={{ width: `${progress}%` }}
        >
          {/* Glow effect at the end */}
          <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-transparent to-white/30" />
        </div>
      </div>

      <Card
        className={cn(
          'w-full max-w-2xl mx-auto',
          'p-6 sm:p-8',
          'space-y-8',
          'bg-card/60 backdrop-blur-md border-white/60 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.4)]'
        )}
        role="region"
        aria-label={t('header', 'Preparing your task...')}
        aria-live="polite"
        aria-busy="true"
      >
        {/* Large animated icon in center */}
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <div className={cn('relative', getAnimationClass(phaseConfig.animation))}>
            {/* Icon with subject color */}
            <PhaseIcon
              className={cn('w-24 h-24 sm:w-32 sm:h-32', theme.colors.text)}
              strokeWidth={1.5}
            />

            {/* Subtle glow effect */}
            <div
              className={cn(
                'absolute inset-0 blur-2xl opacity-30',
                theme.colors.bg,
                'rounded-full -z-10'
              )}
            />
          </div>

          {/* Stage message */}
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
              {phaseConfig.label}
            </h2>
            <p className="text-sm text-muted-foreground">
              {showAlmostThere
                ? t('almostThere', 'Almost there... generating a great question for you!')
                : t('timeRemaining', {
                    seconds: Math.max(0, Math.ceil(20 - (progress / 100) * 20)),
                  })}
            </p>
          </div>
        </div>

        {/* Content section with carousel */}
        <TaskLoadingContent subject={subject} progress={progress} className="-mt-4" />
      </Card>

      {/* CSS for custom animations */}
      <style>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.05);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          25% {
            opacity: 0.5;
            transform: scale(0.95);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
          75% {
            opacity: 0.6;
            transform: scale(0.98);
          }
        }

        @keyframes scale-pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-twinkle {
          animation: twinkle 1.5s ease-in-out infinite;
        }

        .animate-scale-pulse {
          animation: scale-pulse 1s ease-in-out infinite;
        }

        /* Respect reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .animate-pulse-slow,
          .animate-spin-slow,
          .animate-twinkle,
          .animate-scale-pulse {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}
