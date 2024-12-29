import { ReactNode } from 'react'
import { background, size, cn } from '../styles'

interface PageProps {
  children: ReactNode
  className?: string
  background?: 'gradient' | 'white' | 'gray'
}

const backgroundMap = {
  gradient: background.gradient.blue,
  white: background.solid.white,
  gray: background.solid.gray
}

export function Page({ 
  children, 
  className = '',
  background = 'gradient'
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