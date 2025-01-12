import { ReactNode } from 'react'
import { BaseVariant } from '../../types'

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6
export type HeadingColor = BaseVariant | 'muted' | 'white'

export interface HeadingProps {
  /** The content to display */
  children: ReactNode
  /** The heading level (h1-h6) */
  level?: HeadingLevel
  /** The color of the heading */
  color?: HeadingColor
  /** Additional CSS classes */
  className?: string
} 