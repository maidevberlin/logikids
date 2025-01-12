import { InputHTMLAttributes } from 'react'
import { cn } from '../../../../utils/cn'
import { styles } from './styles'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  className?: string
  error?: boolean
  onChange?: (value: string) => void
}

export function Input({ className, error, onChange, ...props }: InputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value)
  }

  return (
    <input
      type="text"
      className={cn(
        styles.field.base,
        error && styles.field.error,
        className
      )}
      onChange={handleChange}
      {...props}
    />
  )
} 