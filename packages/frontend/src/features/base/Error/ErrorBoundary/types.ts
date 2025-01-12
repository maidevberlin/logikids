import { ReactNode } from 'react'

export interface ErrorBoundaryProps {
  /** The content to render */
  children: ReactNode
  /** Whether to show error details (like stack trace) in production */
  showErrorDetails?: boolean
  /** Custom error message */
  fallbackMessage?: string
  /** Whether to show the home button */
  showHomeButton?: boolean
  /** Additional CSS classes */
  className?: string
}

export interface ErrorBoundaryState {
  /** Whether an error has occurred */
  hasError: boolean
  /** The error that occurred */
  error?: Error
} 