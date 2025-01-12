import { ReactNode } from 'react'
import { styles } from './styles'

export type PageBackground = keyof typeof styles.variants

export interface PageProps {
  children: ReactNode
  className?: string
  background?: 'white' | 'gradient'
  navigation: ReactNode
} 