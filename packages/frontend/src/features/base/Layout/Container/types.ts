import { ReactNode } from 'react'

export type ContainerWidth = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface ContainerProps {
  children: ReactNode
  className?: string
  maxWidth?: ContainerWidth
} 