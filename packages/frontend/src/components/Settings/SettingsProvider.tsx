import { ReactNode } from 'react'
import { SettingsButton } from './SettingsButton'

interface SettingsProviderProps {
  children: ReactNode
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  return (
    <>
      <SettingsButton />
      {children}
    </>
  )
} 