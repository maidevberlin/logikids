import { ReactNode } from 'react'

export interface InteractiveProps {
  /** The content to animate */
  children: ReactNode
  /** The HTML element to render as */
  as?: 'div' | 'button'
  /** Click handler */
  onClick?: () => void
  /** Whether the element is disabled */
  disabled?: boolean
  /** Additional CSS classes */
  className?: string
} 