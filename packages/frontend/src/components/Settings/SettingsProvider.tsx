import { ReactNode, useState } from 'react'
import { SettingsButton } from './SettingsButton'
import { SettingsModal } from './SettingsModal'
import { useSettings } from '../../hooks/useSettings'

interface SettingsProviderProps {
  children: ReactNode
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const { settings, updateAge, updateName } = useSettings()

  return (
    <>
      <SettingsButton onClick={() => setIsSettingsOpen(true)} />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        age={settings.age}
        name={settings.name}
        onAgeChange={updateAge}
        onNameChange={updateName}
      />
      {children}
    </>
  )
} 