import { ReactNode } from 'react'
import { getColorClasses } from '../../theme/utils'

interface CardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'primary' | 'success' | 'error' | 'warning'
  interactive?: boolean
  elevated?: boolean
  onClick?: () => void
}

export function Card({ 
  children, 
  className = '',
  variant = 'default',
  interactive = false,
  elevated = false,
  onClick
}: CardProps) {
  const colorClasses = getColorClasses({
    variant,
    bg: true,
    border: true,
    hover: interactive
  })

  return (
    <div
      className={`
        ${colorClasses}
        bg-white
        rounded-xl border
        p-6
        ${elevated ? 'shadow-lg' : 'shadow-sm'}
        ${interactive ? 'cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]' : ''}
        ${className}
      `}
      onClick={interactive ? onClick : undefined}
    >
      {children}
    </div>
  )
} 