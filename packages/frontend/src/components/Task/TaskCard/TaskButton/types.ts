export type TaskButtonVariant = 'primary' | 'outline'

export interface TaskButtonProps {
  onClick?: () => void
  variant?: TaskButtonVariant
  disabled?: boolean
  className?: string
} 