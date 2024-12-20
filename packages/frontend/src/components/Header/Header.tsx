import { SettingsButton } from '../Settings/SettingsButton'
import logoUrl from '../../logo.svg'

interface HeaderProps {
  onSettingsClick: () => void
}

export function Header({ onSettingsClick }: HeaderProps) {
  return (
    <header className="flex justify-between items-center p-4 bg-white/50 backdrop-blur-sm">
      <img src={logoUrl} alt="Logo" className="h-12 w-auto" />
      <SettingsButton onClick={onSettingsClick} />
    </header>
  )
} 