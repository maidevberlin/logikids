import { ButtonHTMLAttributes } from 'react'
import { getColorClasses } from '../../theme/utils'

type ButtonVariant = 'primary' | 'success' | 'error' | 'warning' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

const sizeClasses: Record<ButtonSize, string> = {
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