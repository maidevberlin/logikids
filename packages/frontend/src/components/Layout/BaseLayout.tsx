import { ReactNode } from 'react'
import { SettingsButton } from '../Settings/SettingsButton'
import { SettingsModal } from '../Settings/SettingsModal'
import { useSettings } from '../../hooks/useSettings'
import { useState } from 'react'

interface BaseLayoutProps {
  children: ReactNode
}

export function BaseLayout({ children }: BaseLayoutProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const { settings, updateAge, updateName } = useSettings()

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
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
    </div>
  )
} 