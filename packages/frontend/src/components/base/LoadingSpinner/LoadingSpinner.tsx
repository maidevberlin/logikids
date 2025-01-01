import { HTMLAttributes } from 'react'
import { cn } from '../styles/utils'

interface LoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  /** Size variant of the spinner */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Whether to show the spinner in a container */
  container?: boolean
  /** Whether the container should be fullscreen */
  fullScreen?: boolean
  /** Color variant of the spinner */
  variant?: 'primary' | 'secondary' | 'white'
}

const sizeClasses = {
  sm: 'w-4 h-4 border',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-2',
  xl: 'w-12 h-12 border-2'
}

const variantClasses = {
  primary: 'border-primary-200 border-t-primary-600',
  secondary: 'border-gray-200 border-t-gray-600',
  white: 'border-white/30 border-t-white'
}

export function LoadingSpinner({ 
  size = 'md', 
  container = false,
  fullScreen = false,
  variant = 'primary',
  className = '',
  ...props 
}: LoadingSpinnerProps) {
  const spinner = (
    <div
      className={cn(
        sizeClasses[size],
        variantClasses[variant],
        'animate-spin rounded-full',
        className
      )}
      {...props}
    />
  )

  if (!container) return spinner

  return (
    <div 
      className={cn(
        'flex items-center justify-center bg-white',
        fullScreen ? 'fixed inset-0 z-50' : 'absolute inset-0',
        'rounded-xl'
      )}
    >
      {spinner}
    </div>
  )
} 