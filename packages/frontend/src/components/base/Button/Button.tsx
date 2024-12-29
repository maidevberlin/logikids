import { ButtonHTMLAttributes } from 'react'
import { getColorClasses } from '../../../theme/utils'
import { BaseSize, BaseStyleProps, BaseSizeProps, BaseVariantProps } from '../types'

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

export function Button({ 
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled = false,
  children,
  ...props
}: ButtonProps) {
  const colorVariant = variant === 'outline' ? 'default' : variant
  const colorClasses = getColorClasses({
    variant: colorVariant,
    text: variant === 'outline',
    border: variant === 'outline',
    hover: !disabled
  })

  return (
    <button
      className={`
        ${sizeClasses[size]}
        ${colorClasses}
        ${fullWidth ? 'w-full' : ''}
        rounded-lg font-medium transition-all duration-200
        ${variant === 'outline' ? 'border-2' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md active:scale-95'}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
} 