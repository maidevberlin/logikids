import { ReactNode } from 'react'
import { spacing, cn } from '../styles'

interface SectionProps {
  children: ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function Section({ 
  children, 
  className = '',
  padding = 'md'
}: SectionProps) {
  return (
    <section className={cn(
      spacing.padding[padding],
      className
    )}>
      {children}
    </section>
  )
} 