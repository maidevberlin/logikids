import { ReactNode } from 'react'
import { background, size, cn } from '../styles'

interface PageProps {
  children: ReactNode
  className?: string
  background?: 'gradient' | 'white'
}

const backgroundMap = {
  gradient: background.gradient.blue,
  white: background.solid.white
}

export function Page({ 
  children, 
  className = '',
  background = 'white'
}: PageProps) {
  return (
    <main className={cn(
      size.screen,
      backgroundMap[background],
      className
    )}>
      {children}
    </main>
  )
} 