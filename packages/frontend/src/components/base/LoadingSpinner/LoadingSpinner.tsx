import { HTMLAttributes } from 'react'

interface LoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8'
}

export function LoadingSpinner({ 
  size = 'md', 
  className = '',
  ...props 
}: LoadingSpinnerProps) {
  return (
    <div
      className={`
        ${sizeClasses[size]}
        animate-spin rounded-full
        border-2 border-primary-200
        border-t-primary-600
        ${className}
      `}
      {...props}
    />
  )
} 