import { ElementType, ReactNode } from 'react'
import { CoreVariant } from '../../types'

export type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl'
export type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold'
export type TextColor = CoreVariant | 'muted' | 'white'

export interface TextProps {
  children: ReactNode
  size?: TextSize
  weight?: TextWeight
  color?: TextColor
  className?: string
  as?: ElementType
  htmlFor?: string
} 