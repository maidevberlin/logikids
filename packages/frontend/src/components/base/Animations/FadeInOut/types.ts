import { ReactNode } from 'react'

export interface FadeInOutProps {
  /** The content to animate */
  children: ReactNode
  /** Whether to show the content */
  show?: boolean
  /** The direction of the fade animation */
  direction?: 'up' | 'down'
  /** Additional CSS classes */
  className?: string
  /** Animation duration in milliseconds */
  duration?: number
} 