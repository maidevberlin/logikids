import { ReactNode } from 'react'
import { container } from '../styles/common'
import { cn } from '../styles/utils'

type ContainerWidth = 'sm' | 'md' | 'lg' | 'xl' | 'full'

interface ContainerProps {
  children: ReactNode
  maxWidth?: ContainerWidth
  className?: string
}

export function Container({ 
  children, 
  maxWidth = 'lg',
  className = '' 
}: ContainerProps) {
  return (
    <div className={cn(
      container.base,
      container.maxWidth[maxWidth],
      className
    )}>
      {children}
    </div>
  )
} 