import { SettingsButton } from '../Settings/SettingsButton'
import { flex, spacing, background } from '../base/styles'
import { cn } from '../base/styles/utils'
import logoUrl from '../../logo.svg'

interface HeaderProps {
  onSettingsClick: () => void
}

export function Header({ onSettingsClick }: HeaderProps) {
  return (
    <header className={cn(
      flex.between,
      spacing.padding.md,
      background.solid.white,
      'bg-opacity-50 backdrop-blur-sm'
    )}>
      <img src={logoUrl} alt="Logo" className="h-12 w-auto" />
      <SettingsButton onClick={onSettingsClick} />
    </header>
  )
} 