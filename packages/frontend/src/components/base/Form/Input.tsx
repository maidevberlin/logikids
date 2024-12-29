import { ChangeEvent, InputHTMLAttributes } from 'react'
import { getColorClasses } from '../../../theme/utils'

type InputSize = 'sm' | 'md' | 'lg'
type InputVariant = 'default' | 'error'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  value: string | number
  onChange: (value: string) => void
  label?: string
  error?: string
  size?: InputSize
  variant?: InputVariant
  fullWidth?: boolean
}

const sizeClasses: Record<InputSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
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

  const colorClasses = getColorClasses({
    variant: variant === 'error' ? 'error' : 'default',
    border: true,
    text: true,
    hover: true
  })

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className={`
          block mb-2 font-medium
          ${getColorClasses({ variant: 'default', text: true })}
        `}>
          {label}
        </label>
      )}
      <input
        value={value}
        onChange={handleChange}
        className={`
          ${sizeClasses[size]}
          ${colorClasses}
          w-full rounded-lg border-2
          focus:outline-none focus:ring-2 focus:ring-offset-2
          transition-colors duration-200
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className={`
          mt-2 text-sm
          ${getColorClasses({ variant: 'error', text: true })}
        `}>
          {error}
        </p>
      )}
    </div>
  )
} 