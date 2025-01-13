import { ReactNode } from 'react'
import { CoreVariant } from '../../types'

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

export type HeadingColor = CoreVariant | 'muted' | 'white'

export interface HeadingProps {
  children: ReactNode
  level?: HeadingLevel
  color?: HeadingColor
  className?: string
} 