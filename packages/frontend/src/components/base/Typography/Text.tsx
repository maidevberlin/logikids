import { ReactNode } from 'react'
import { getColorClasses } from '../../../theme/utils'
import type { ColorVariant } from '../../../theme/utils'

type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl'
type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold'
type TextColor = ColorVariant | 'muted'

interface TextProps {
  children: ReactNode
  size?: TextSize
  weight?: TextWeight
  color?: TextColor
  className?: string
  as?: 'p' | 'span' | 'div' | 'label'
  htmlFor?: string
}

const sizeClasses: Record<TextSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl'
}

const weightClasses: Record<TextWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold'
}

export function Text({
  children,
  size = 'base',
  weight = 'normal',
  color = 'default',
  className = '',
  as: Component = 'p',
  htmlFor
}: TextProps) {
  const colorClasses = getColorClasses({
    variant: color === 'muted' ? 'default' : color,
    text: true
  })

  if (color === 'muted') {
    return (
      <Component
        className={`
          ${sizeClasses[size]}
          ${weightClasses[weight]}
          text-gray-600
          ${className}
        `}
        {...(htmlFor ? { htmlFor } : {})}
      >
        {children}
      </Component>
    )
  }

  return (
    <Component
      className={`
        ${sizeClasses[size]}
        ${weightClasses[weight]}
        ${colorClasses}
        ${className}
      `}
      {...(htmlFor ? { htmlFor } : {})}
    >
      {children}
    </Component>
  )
} 