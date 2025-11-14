import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { getLoadingContent, getEncouragement } from '@/data/loadingContent'
import { Lightbulb, Sparkles, BookOpen, Heart } from 'lucide-react'

/**
 * Props for the TaskLoadingContent component
 */
export interface TaskLoadingContentProps {
  /**
   * Subject identifier for content selection (e.g., 'math', 'physics')
   */
  subject: string

  /**
   * Current progress percentage (0-100), determines stage message
   */
  progress: number

  /**
   * Additional CSS classes for the container
   */
  className?: string
}

/**
 * Content type for rotation
 */
type ContentType = 'tip' | 'fact' | 'preview' | 'encouragement'

/**
 * Content item with text and type
 */
interface ContentItem {
  key: string // i18n key
  type: ContentType
}

/**
 * Get the stage message key based on current progress
 */
function getStageMessageKey(progress: number): string {
  if (progress < 20) return 'stages.analyzing'
  if (progress < 50) return 'stages.crafting'
  if (progress < 80) return 'stages.generating'
  return 'stages.finalizing'
}

/**
 * Get icon component for content type
 */
function getContentIcon(type: ContentType) {
  switch (type) {
    case 'tip':
      return Lightbulb
    case 'fact':
      return Sparkles
    case 'preview':
      return BookOpen
    case 'encouragement':
      return Heart
    default:
      return BookOpen
  }
}

/**
 * Get color classes for content type
 * Uses theme-aware primary color for all types to integrate with time themes
 */
function getContentColors(type: ContentType): string {
  // Use primary color for all content types to respect time themes
  return 'text-primary'
}

/**
 * Get border color classes for content type
 * Uses theme-aware primary color for all types to integrate with time themes
 */
function getBorderColorClass(type: ContentType): string {
  // Use primary color for all content types to respect time themes
  return 'border-primary'
}

/**
 * Get label for content type
 */
function getContentLabel(type: ContentType, t: (key: string) => string): string {
  switch (type) {
    case 'tip':
      return t('contentTypes.tip') || 'Tip'
    case 'fact':
      return t('contentTypes.fact') || 'Did you know?'
    case 'preview':
      return t('contentTypes.preview') || 'Coming up'
    case 'encouragement':
      return t('contentTypes.encouragement') || 'Encouragement'
    default:
      return 'Info'
  }
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * TaskLoadingContent Component
 *
 * Displays rotating educational content during task generation.
 * Rotates through tips, facts, previews, and encouragement messages
 * with smooth fade transitions.
 *
 * Features:
 * - Stage-based messages that change with progress
 * - Content carousel rotating every 5-6 seconds
 * - Fade in/out transitions (300ms)
 * - Different icons for different content types
 * - Accessibility support with aria-live
 * - Pauses rotation when user focuses on text
 * - Random selection to avoid repetition
 * - Mobile responsive
 *
 * @example
 * ```tsx
 * <TaskLoadingContent subject="math" progress={45} />
 * ```
 */
export function TaskLoadingContent({
  subject,
  progress,
  className
}: TaskLoadingContentProps) {
  const { t } = useTranslation('loading')

  // State for current content item
  const [currentContent, setCurrentContent] = useState<ContentItem | null>(null)
  const [isVisible, setIsVisible] = useState(true)
  const [isPaused, setIsPaused] = useState(false)

  // Refs for managing intervals and content queue
  const rotationIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const contentQueueRef = useRef<ContentItem[]>([])
  const contentIndexRef = useRef(0)

  // Initialize content queue on mount or when subject changes
  useEffect(() => {
    const subjectContent = getLoadingContent(subject)
    const encouragementMessages = getEncouragement()

    // Build complete content pool
    const allContent: ContentItem[] = [
      ...subjectContent.tips.map(key => ({ key, type: 'tip' as ContentType })),
      ...subjectContent.facts.map(key => ({ key, type: 'fact' as ContentType })),
      ...subjectContent.previews.map(key => ({ key, type: 'preview' as ContentType })),
      ...encouragementMessages.map(key => ({ key, type: 'encouragement' as ContentType }))
    ]

    // Shuffle to avoid predictable order
    contentQueueRef.current = shuffleArray(allContent)
    contentIndexRef.current = 0

    // Set initial content
    if (contentQueueRef.current.length > 0) {
      setCurrentContent(contentQueueRef.current[0])
      setIsVisible(true)
    }
  }, [subject])

  // Content rotation effect
  useEffect(() => {
    // Clear any existing interval first to avoid race conditions
    if (rotationIntervalRef.current) {
      clearInterval(rotationIntervalRef.current)
      rotationIntervalRef.current = null
    }

    if (isPaused || contentQueueRef.current.length === 0) {
      return
    }

    // Rotate content every 5-6 seconds (randomized for natural feel)
    const rotationDelay = 5000 + Math.random() * 1000

    rotationIntervalRef.current = setInterval(() => {
      // Fade out current content
      setIsVisible(false)

      // Wait for fade out animation to complete
      setTimeout(() => {
        // Move to next content item
        contentIndexRef.current = (contentIndexRef.current + 1) % contentQueueRef.current.length
        setCurrentContent(contentQueueRef.current[contentIndexRef.current])

        // Fade in new content
        setIsVisible(true)
      }, 300) // Match fade-out duration
    }, rotationDelay)

    return () => {
      if (rotationIntervalRef.current) {
        clearInterval(rotationIntervalRef.current)
      }
    }
  }, [isPaused])

  // Get current stage message
  const stageMessageKey = getStageMessageKey(progress)
  const stageMessage = t(stageMessageKey)

  // Handle focus/blur to pause rotation for accessibility
  const handleContentFocus = () => {
    setIsPaused(true)
  }

  const handleContentBlur = () => {
    setIsPaused(false)
  }

  if (!currentContent) {
    return null
  }

  const Icon = getContentIcon(currentContent.type)
  const colorClass = getContentColors(currentContent.type)
  const borderColorClass = getBorderColorClass(currentContent.type)
  const label = getContentLabel(currentContent.type, t)
  const contentText = t(currentContent.key)

  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* Stage message */}
      <div
        className="text-center"
        aria-live="polite"
        aria-atomic="true"
      >
        <p className="text-sm font-medium text-muted-foreground">
          {stageMessage}
        </p>
      </div>

      {/* Content card */}
      <div
        className={cn(
          'relative min-h-[120px] sm:min-h-[100px]',
          'rounded-lg border-2 border-dashed border-border',
          'bg-card',
          'p-6',
          'transition-all duration-300',
          'shadow-sm hover:shadow-md'
        )}
        onFocus={handleContentFocus}
        onBlur={handleContentBlur}
        onMouseEnter={handleContentFocus}
        onMouseLeave={handleContentBlur}
        tabIndex={0}
        role="region"
        aria-label="Loading content"
      >
        {/* Animated content */}
        <div
          className={cn(
            'transition-opacity duration-300 ease-in-out',
            isVisible ? 'opacity-100' : 'opacity-0'
          )}
          aria-live="polite"
          aria-atomic="true"
        >
          {/* Content type label with icon */}
          <div className="flex items-center gap-2 mb-3">
            <Icon className={cn('w-5 h-5', colorClass)} aria-hidden="true" />
            <span className={cn('text-xs font-semibold uppercase tracking-wide', colorClass)}>
              {label}
            </span>
          </div>

          {/* Content text */}
          <p className="text-sm sm:text-base leading-relaxed text-foreground">
            {contentText}
          </p>
        </div>

        {/* Subtle pulse effect on border (only when not paused) */}
        {!isPaused && (
          <div
            className={cn(
              'absolute inset-0 rounded-lg border-2 border-dashed',
              borderColorClass,
              'opacity-0 animate-pulse-border pointer-events-none'
            )}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Rotation indicator (dots) */}
      <div className="flex justify-center gap-1.5" aria-hidden="true">
        {Array.from({ length: Math.min(5, contentQueueRef.current.length) }).map((_, index) => {
          const isActive = contentIndexRef.current === index
          return (
            <div
              key={index}
              className={cn(
                'w-1.5 h-1.5 rounded-full transition-all duration-300',
                isActive
                  ? 'bg-primary w-4'
                  : 'bg-muted-foreground/40'
              )}
            />
          )
        })}
      </div>

      {/* CSS for pulse border animation */}
      <style>{`
        @keyframes pulse-border {
          0%, 100% {
            opacity: 0;
          }
          50% {
            opacity: 0.3;
          }
        }

        .animate-pulse-border {
          animation: pulse-border 2s ease-in-out infinite;
        }

        /* Respect reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .animate-pulse-border {
            animation: none;
            opacity: 0;
          }
          .transition-opacity,
          .transition-all {
            transition: none;
          }
        }
      `}</style>
    </div>
  )
}
