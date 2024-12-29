import { ReactNode } from 'react'
import { text, cn } from '../styles'

interface LabelProps {
  children: ReactNode
  htmlFor?: string
  required?: boolean
  className?: string
}

export function Label({
  children,
  htmlFor,
  required = false,
  className = ''
}: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        text.size.sm,
        text.weight.medium,
        text.color.default,
        'block',
        className
      )}
    >
      {children}
      {required && (
        <span className={cn(
          text.color.error,
          'ml-1'
        )} aria-hidden="true">*</span>
      )}
    </label>
  )
} 