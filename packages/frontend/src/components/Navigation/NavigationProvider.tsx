import { ReactNode } from 'react'
import { SettingsButton } from '../Settings/SettingsButton'
import { StatsButton } from '../Stats/StatsButton'
import { TaskButton } from '../Task/TaskButton'

interface NavigationProviderProps {
  children: ReactNode
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  return (
    <>
      <TaskButton />
      <StatsButton />
      <SettingsButton />
      {children}
    </>
  )
} 