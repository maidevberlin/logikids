import { ReactNode } from 'react'
import { Button } from '../base/Button'
import { BaseSize } from '../base/types'

interface TaskOptionProps {
  onSelect: () => void
  label: ReactNode
  disabled?: boolean
  variant?: 'primary' | 'success' | 'error' | 'warning' | 'outline'
  size?: BaseSize
  className?: string
}

export function TaskOption({ 
  onSelect, 
  label, 
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = ''
}: TaskOptionProps) {
  return (
    <Button
      onClick={onSelect}
      disabled={disabled}
      variant={variant}
      size={size}
      fullWidth
      className={className}
    >
      {label}
    </Button>
  )
} 