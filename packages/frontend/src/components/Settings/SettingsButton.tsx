import { Cog6ToothIcon } from '@heroicons/react/24/outline'

interface SettingsButtonProps {
  onClick: () => void
}

export function SettingsButton({ onClick }: SettingsButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed top-4 right-4 rounded-full bg-white p-2 text-gray-400 shadow-lg hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      <span className="sr-only">Open settings</span>
      <Cog6ToothIcon className="h-6 w-6" aria-hidden="true" />
    </button>
  )
} 