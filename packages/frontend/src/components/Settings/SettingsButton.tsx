import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { interactive, position } from '../base/styles'
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
        'text-gray-500 hover:text-primary-600',
        interactive.transition,
        'z-10'
      )}
    >
      <span className="sr-only">Open settings</span>
      <Cog6ToothIcon className="h-5 w-5" aria-hidden="true" />
    </button>
  )
} 