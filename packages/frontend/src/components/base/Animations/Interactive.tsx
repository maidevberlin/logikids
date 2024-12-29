import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface InteractiveProps {
  children: ReactNode
  as?: 'div' | 'button'
  onClick?: () => void
  disabled?: boolean
  className?: string
}

export function Interactive({ 
  children, 
  as = 'div',
  onClick,
  disabled = false,
  className = ''
}: InteractiveProps) {
  const Component = motion[as]

  return (
    <Component
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      className={className}
    >
      {children}
    </Component>
  )
} 