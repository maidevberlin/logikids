import { ReactNode } from 'react'
import { ComponentType } from 'react'

export type TaskOptionVariant = 
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'

export type IconPosition = 'left' | 'right'

export interface TaskOptionProps {
  onClick: () => void
  label: ReactNode
  disabled?: boolean
  variant?: TaskOptionVariant
  className?: string
  icon?: ComponentType<{ className?: string }>
  iconPosition?: IconPosition
} 