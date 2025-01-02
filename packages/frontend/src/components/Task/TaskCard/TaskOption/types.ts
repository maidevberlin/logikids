import { ReactNode } from 'react'

export type TaskOptionVariant = 'primary' | 'success' | 'error' | 'warning' | 'outline'
export type TaskOptionSize = 'md' | 'lg'

export interface TaskOptionProps {
  onClick: () => void
  label: ReactNode
  disabled?: boolean
  variant?: TaskOptionVariant
  size?: TaskOptionSize
  className?: string
  isSelected?: boolean
  isCorrect?: boolean | null
  useHtml?: boolean
} 