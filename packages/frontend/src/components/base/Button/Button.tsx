import React, { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../styles/utils'
import { BaseSize, BaseStyleProps, BaseSizeProps, BaseVariantProps, BaseColorVariant } from '../types'

interface ButtonProps extends 
  ButtonHTMLAttributes<HTMLButtonElement>,
  BaseStyleProps,
  BaseSizeProps,
  BaseVariantProps {
  /** Whether the button should take up the full width of its container */
  fullWidth?: boolean
  /** Whether the button is in a loading state */
  isLoading?: boolean
  /** Icon to display before the button text */
  leftIcon?: ReactNode
  /** Icon to display after the button text */
  rightIcon?: ReactNode
  /** Whether to show only the icon (will center the icon) */
  iconOnly?: boolean
}

const sizeClasses: Record<BaseSize, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-base gap-2',
  lg: 'px-6 py-3 text-lg gap-2.5'
}

const iconSizeClasses: Record<BaseSize, string> = {
  sm: 'p-1.5',
  md: 'p-2',
  lg: 'p-3'
}

const iconClasses: Record<BaseSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6'
}

const variantClasses: Record<NonNullable<BaseColorVariant>, string> = {
  default: 'bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500',
  primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
  secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white focus:ring-secondary-500',
  success: 'bg-success-600 hover:bg-success-700 text-white focus:ring-success-500',
  error: 'bg-error-600 hover:bg-error-700 text-white focus:ring-error-500',
  warning: 'bg-warning-600 hover:bg-warning-700 text-white focus:ring-warning-500',
  info: 'bg-info-600 hover:bg-info-700 text-white focus:ring-info-500',
  outline: 'border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50 focus:ring-gray-500'
}

export function Button({ 
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  iconOnly = false,
  className = '',
  disabled = false,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading

  // Clone icons with proper size classes
  const leftIconElement = leftIcon && (
    <span className={iconClasses[size]}>
      {React.cloneElement(leftIcon as React.ReactElement, {
        className: iconClasses[size]
      })}
    </span>
  )

  const rightIconElement = rightIcon && (
    <span className={iconClasses[size]}>
      {React.cloneElement(rightIcon as React.ReactElement, {
        className: iconClasses[size]
      })}
    </span>
  )

  const iconElement = iconOnly && children && (
    <span className={iconClasses[size]}>
      {React.cloneElement(children as React.ReactElement, {
        className: iconClasses[size]
      })}
    </span>
  )

  return (
    <button
      className={cn(
        // Base styles
        'rounded-lg font-medium transition-all duration-200',
        'inline-flex items-center justify-center',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        
        // Size styles
        iconOnly ? iconSizeClasses[size] : sizeClasses[size],
        
        // Variant styles
        variantClasses[variant],
        
        // Width styles
        fullWidth && 'w-full',
        
        // State styles
        isDisabled && 'opacity-50 cursor-not-allowed',
        !isDisabled && 'hover:shadow-md active:scale-95',
        
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <div className={cn(
          'animate-spin rounded-full border-2',
          variant === 'outline' ? 'border-gray-600 border-t-transparent' : 'border-white border-t-transparent',
          iconClasses[size]
        )} />
      ) : (
        <>
          {leftIconElement}
          {!iconOnly && children}
          {iconOnly && iconElement}
          {rightIconElement}
        </>
      )}
    </button>
  )
} 