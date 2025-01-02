import { ReactNode } from 'react'
import { styles } from './styles'

export type SectionSize = keyof typeof styles.sizes

export interface SectionProps {
  children: ReactNode
  className?: string
  size?: SectionSize
} 