import { ChangeEvent, InputHTMLAttributes } from 'react'
import { cn } from '../styles/utils'
import { BaseSize } from '../types'

type InputVariant = 'default' | 'error'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  value: string | number
  onChange: (value: string) => void
  label?: string
  error?: string
  size?: BaseSize
  variant?: InputVariant
  fullWidth?: boolean
}

const sizeClasses: Record<BaseSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
}

const variantClasses: Record<InputVariant, string> = {
  default: 'border-gray-300 hover:border-gray-400 focus:border-primary-500 focus:ring-primary-500',
  error: 'border-error-300 hover:border-error-400 text-error-900 focus:border-error-500 focus:ring-error-500'
}

export function Input({
  value,
  onChange,
  label,
  error,
  size = 'md',
  variant = 'default',
  fullWidth = false,
  className = '',
  ...props
}: InputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className={cn(fullWidth && 'w-full')}>
      {label && (
        <label className="block mb-2 font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        value={value}
        onChange={handleChange}
        className={cn(
          'w-full rounded-lg border-2',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'transition-colors duration-200',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-error-600">
          {error}
        </p>
      )}
    </div>
  )
} 