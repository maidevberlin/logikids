import { ReactNode } from 'react'
import { BaseVariant } from '../../types'

export type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl'
export type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold'
export type TextColor = BaseVariant | 'muted' | 'white'
export type TextElement = 'p' | 'span' | 'div' | 'label'

export interface TextProps {
  /** The content to display */
  children: ReactNode
  /** The size of the text */
  size?: TextSize
  /** The font weight of the text */
  weight?: TextWeight
  /** The color of the text */
  color?: TextColor
  /** Additional CSS classes */
  className?: string
  /** The HTML element to render */
  as?: TextElement
  /** The ID of the form element this text labels */
  htmlFor?: string
} 