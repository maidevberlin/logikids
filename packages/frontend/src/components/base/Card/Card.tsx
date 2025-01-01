import { ReactNode } from 'react'
import { cn } from '../styles/utils'
import { BaseVariant, BaseStyleProps, BaseInteractiveProps } from '../types'

interface CardProps extends BaseStyleProps, BaseInteractiveProps {
  children: ReactNode
  elevated?: boolean
  variant?: BaseVariant
}

const variantClasses: Record<BaseVariant, string> = {
  default: 'bg-white border-gray-200 hover:border-gray-300',
  primary: 'bg-white border-primary-200 hover:border-primary-300',
  success: 'bg-white border-success-200 hover:border-success-300',
  error: 'bg-white border-error-200 hover:border-error-300',
  warning: 'bg-white border-warning-200 hover:border-warning-300'
}

export function Card({ 
  children, 
  className = '',
  variant = 'default',
  elevated = false,
  disabled = false,
  onClick
}: CardProps) {
  const interactive = !!onClick && !disabled

  return (
    <div
      className={cn(
        'rounded-xl border p-6',
        variantClasses[variant],
        elevated ? 'shadow-lg' : 'shadow-sm',
        interactive && 'cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={interactive ? onClick : undefined}
    >
      {children}
    </div>
  )
} 