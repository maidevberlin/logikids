import { cn } from '../styles/utils'
import { BaseSize } from '../types'

type SpinnerSize = BaseSize | 'xl'
type SpinnerColor = 'primary' | 'secondary' | 'white'

interface LoadingSpinnerProps {
  /** The size of the spinner */
  size?: SpinnerSize
  /** The color of the spinner */
  color?: SpinnerColor
  /** Additional CSS classes */
  className?: string
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-3',
  xl: 'h-12 w-12 border-4'
}

const colorClasses: Record<SpinnerColor, string> = {
  primary: 'border-primary-200 border-t-primary-600',
  secondary: 'border-secondary-200 border-t-secondary-600',
  white: 'border-white/30 border-t-white'
}

export function LoadingSpinner({ 
  size = 'md',
  color = 'primary',
  className = ''
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  )
} 