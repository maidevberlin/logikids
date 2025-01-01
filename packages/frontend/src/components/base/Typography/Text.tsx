import { ReactNode } from 'react'
import { cn } from '../styles/utils'
import { BaseVariant } from '../types'

type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl'
type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold'
type TextColor = BaseVariant | 'muted' | 'white'

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

const colorClasses: Record<TextColor, string> = {
  default: 'text-gray-900',
  muted: 'text-gray-600',
  primary: 'text-primary-600',
  success: 'text-success-600',
  error: 'text-error-600',
  warning: 'text-warning-600',
  white: 'text-white'
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
  return (
    <Component
      className={cn(
        sizeClasses[size],
        weightClasses[weight],
        colorClasses[color],
        className
      )}
      {...(htmlFor ? { htmlFor } : {})}
    >
      {children}
    </Component>
  )
} 