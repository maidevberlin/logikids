import { ReactNode } from 'react'
import { getColorClasses } from '../../../theme/utils'
import type { ColorVariant } from '../../../theme/utils'

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

interface HeadingProps {
  level: HeadingLevel
  children: ReactNode
  variant?: ColorVariant
  className?: string
}

const sizeClasses: Record<HeadingLevel, string> = {
  1: 'text-4xl',
  2: 'text-3xl',
  3: 'text-2xl',
  4: 'text-xl',
  5: 'text-lg',
  6: 'text-base'
}

export function Heading({ 
  level, 
  children, 
  variant = 'default',
  className = '' 
}: HeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements
  const colorClasses = getColorClasses({
    variant,
    text: true
  })

  return (
    <Tag 
      className={`
        ${sizeClasses[level]}
        ${colorClasses}
        font-bold
        ${className}
      `}
    >
      {children}
    </Tag>
  )
} 