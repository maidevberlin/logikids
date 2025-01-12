export type FeedbackVariant = 'success' | 'error' | 'warning' | 'info'

export interface FeedbackProps {
  /** The message to display */
  message: string
  /** The variant of the feedback */
  variant: FeedbackVariant
  /** Whether to show the icon */
  showIcon?: boolean
  /** Additional CSS classes */
  className?: string
} 