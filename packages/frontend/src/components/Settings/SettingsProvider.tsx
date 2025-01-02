import { SettingsButton } from './SettingsButton'
import { SettingsProviderProps } from './types'

export function SettingsProvider({ children }: SettingsProviderProps) {
  return (
    <>
      <SettingsButton />
      {children}
    </>
  )
} 