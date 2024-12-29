import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { background, border, interactive, position, spacing, text } from '../base/styles'
import { cn } from '../base/styles/utils'

interface SettingsButtonProps {
  onClick: () => void
}

export function SettingsButton({ onClick }: SettingsButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        position.fixed,
        'top-4 right-4',
        border.rounded.full,
        background.solid.white,
        spacing.padding.sm,
        text.color.muted,
        interactive.focus,
        'shadow-lg hover:text-gray-500'
      )}
    >
      <span className="sr-only">Open settings</span>
      <Cog6ToothIcon className="h-6 w-6" aria-hidden="true" />
    </button>
  )
} 