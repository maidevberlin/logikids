import { ComponentProps } from 'react'

export type ErrorSeverity = 'error' | 'warning' | 'fatal'

export interface ErrorDisplayProps {
  /** The error message to display */
  message: string
  /** Optional error details (like stack trace) */
  details?: string
  /** Callback for retry action */
  onRetry?: () => void
  /** Whether the retry action is in progress */
  isLoading?: boolean
  /** If true, wraps the error in a full-screen centered layout with a Card */
  standalone?: boolean
  /** The severity of the error */
  severity?: ErrorSeverity
  /** Whether to show the home button */
  showHomeButton?: boolean
  /** Custom action button */
  action?: {
    label: string
    onClick: () => void
    icon?: React.ComponentType<ComponentProps<'svg'>>
  }
  /** Additional CSS classes */
  className?: string
} 