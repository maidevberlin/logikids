import { SettingsButton } from '../Settings/SettingsButton'
import { flex, spacing, background } from '../base/styles'
import { cn } from '../base/styles/utils'
import logoUrl from '../../logo.svg'

export function Header() {
  return (
    <header className={cn(
      flex.between,
      spacing.padding.md,
      background.solid.white,
      'bg-opacity-50 backdrop-blur-sm'
    )}>
      <img src={logoUrl} alt="Logo" className="h-12 w-auto" />
      <SettingsButton />
    </header>
  )
} 