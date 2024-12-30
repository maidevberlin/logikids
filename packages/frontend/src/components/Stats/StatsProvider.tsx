import { ReactNode } from 'react'
import { StatsButton } from './StatsButton'

interface StatsProviderProps {
  children: ReactNode
}

export function StatsProvider({ children }: StatsProviderProps) {
  return (
    <>
      <StatsButton />
      {children}
    </>
  )
} 