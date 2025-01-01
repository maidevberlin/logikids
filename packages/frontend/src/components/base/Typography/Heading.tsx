import { ReactNode } from 'react'
import { cn } from '../styles/utils'
import { BaseVariant } from '../types'

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6
type HeadingColor = BaseVariant | 'muted' | 'white'

interface HeadingProps {
  children: ReactNode
  level?: HeadingLevel
  color?: HeadingColor
  className?: string
}

const levelClasses: Record<HeadingLevel, string> = {
  1: 'text-4xl font-bold',
  2: 'text-3xl font-bold',
  3: 'text-2xl font-semibold',
  4: 'text-xl font-semibold',
  5: 'text-lg font-medium',
  6: 'text-base font-medium'
}

const colorClasses: Record<HeadingColor, string> = {
  default: 'text-gray-900',
  muted: 'text-gray-600',
  primary: 'text-primary-600',
  success: 'text-success-600',
  error: 'text-error-600',
  warning: 'text-warning-600',
  white: 'text-white'
}

export function Heading({
  children,
  level = 2,
  color = 'default',
  className = ''
}: HeadingProps) {
  const Component = `h${level}` as const

  return (
    <Component
      className={cn(
        levelClasses[level],
        colorClasses[color],
        className
      )}
    >
      {children}
    </Component>
  )
} 