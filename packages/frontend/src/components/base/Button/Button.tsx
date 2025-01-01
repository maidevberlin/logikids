import { ButtonHTMLAttributes } from 'react'
import { cn } from '../styles/utils'
import { BaseSize, BaseStyleProps, BaseSizeProps, BaseVariantProps, BaseColorVariant } from '../types'

interface ButtonProps extends 
  ButtonHTMLAttributes<HTMLButtonElement>,
  BaseStyleProps,
  BaseSizeProps,
  BaseVariantProps {
  fullWidth?: boolean
}

const sizeClasses: Record<BaseSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
}

const variantClasses: Record<NonNullable<BaseColorVariant>, string> = {
  default: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
  primary: 'bg-primary-600 hover:bg-primary-700 text-white',
  success: 'bg-success-600 hover:bg-success-700 text-white',
  error: 'bg-error-600 hover:bg-error-700 text-white',
  warning: 'bg-warning-600 hover:bg-warning-700 text-white',
  outline: 'border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50'
}

export function Button({ 
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled = false,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-lg font-medium transition-all duration-200',
        sizeClasses[size],
        variantClasses[variant],
        fullWidth && 'w-full',
        disabled && 'opacity-50 cursor-not-allowed',
        !disabled && 'hover:shadow-md active:scale-95',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
} 