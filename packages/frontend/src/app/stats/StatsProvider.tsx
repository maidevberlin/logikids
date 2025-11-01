import { ReactNode } from 'react'

interface StatsProviderProps {
  children: ReactNode
}

export function StatsProvider({ children }: StatsProviderProps) {
  return <>{children}</>
} 