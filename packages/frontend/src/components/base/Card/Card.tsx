import { ReactNode } from 'react'
import { getColorClasses } from '../../../theme/utils'
import { BaseVariant, BaseStyleProps, BaseInteractiveProps } from '../types'

interface CardProps extends BaseStyleProps, BaseInteractiveProps {
  children: ReactNode
  elevated?: boolean
  variant?: BaseVariant
}

export function Card({ 
  children, 
  className = '',
  variant = 'default',
  elevated = false,
  disabled = false,
  onClick
}: CardProps) {
  const interactive = !!onClick && !disabled
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
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      onClick={interactive ? onClick : undefined}
    >
      {children}
    </div>
  )
} 