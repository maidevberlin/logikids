import { ReactNode } from 'react'
import { BaseSize } from '../../Button/types'

export type ContainerWidth = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface ContainerProps {
  children: ReactNode
  className?: string
  maxWidth?: ContainerWidth
} 