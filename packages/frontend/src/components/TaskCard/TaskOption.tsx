import { ReactNode } from 'react'
import { Button } from '../base/Button'

interface TaskOptionProps {
  onSelect: () => void
  label: ReactNode
  disabled?: boolean
  variant?: 'primary' | 'success' | 'error' | 'warning' | 'outline'
  className?: string
}

export function TaskOption({ 
  onSelect, 
  label, 
  disabled = false,
  variant = 'primary',
  className = ''
}: TaskOptionProps) {
  return (
    <Button
      onClick={onSelect}
      disabled={disabled}
      variant={variant}
      fullWidth
      className={className}
    >
      {label}
    </Button>
  )
} 