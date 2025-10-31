import React, { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../../utils/cn'
import { BaseStyleProps, BaseSizeProps, BaseVariantProps } from '../types'
import { styles } from './styles'

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
    <span className={styles.iconElementSizes[size]}>
      {React.cloneElement(leftIcon as React.ReactElement, {
        className: styles.iconElementSizes[size]
      })}
    </span>
  )

  const rightIconElement = rightIcon && (
    <span className={styles.iconElementSizes[size]}>
      {React.cloneElement(rightIcon as React.ReactElement, {
        className: styles.iconElementSizes[size]
      })}
    </span>
  )

  const iconElement = iconOnly && children && (
    <span className={styles.iconElementSizes[size]}>
      {React.cloneElement(children as React.ReactElement, {
        className: styles.iconElementSizes[size]
      })}
    </span>
  )

  return (
    <button
      className={cn(
        styles.base,
        // Size styles
        iconOnly ? styles.iconSizes[size] : styles.sizes[size],
        // Variant styles
        styles.variants[variant as keyof typeof styles.variants],
        // Width styles
        fullWidth && styles.states.fullWidth,
        // State styles
        isDisabled ? styles.states.disabled : styles.states.enabled,
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <div className={cn(
          'animate-spin rounded-full border-2',
          variant === 'outline-solid' ? 'border-gray-600 border-t-transparent' : 'border-white border-t-transparent',
          styles.iconElementSizes[size]
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