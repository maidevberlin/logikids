import { useEffect } from 'react'
import { DifficultyNotification } from '@/data/progress/difficultyAdjuster.ts'
import { cn } from '@/lib/utils.ts'

interface DifficultyBannerProps {
  notification: DifficultyNotification
  onDismiss: () => void
}

export function DifficultyBanner({ notification, onDismiss }: DifficultyBannerProps) {
  useEffect(() => {
    if (!notification) return

    const timer = setTimeout(() => {
      onDismiss()
    }, 4000)

    return () => clearTimeout(timer)
  }, [notification, onDismiss])

  if (!notification) return null

  const styles = {
    level_up: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white',
    level_down: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white',
    achievement: 'bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900'
  }

  const icons = {
    level_up: '↑',
    level_down: '↓',
    achievement: '★'
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 animate-slide-down">
      <button
        onClick={onDismiss}
        className={cn(
          'w-full px-6 py-4 flex items-center justify-center gap-3 shadow-lg',
          'transition-all duration-300 hover:opacity-90',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          styles[notification.type]
        )}
        role="button"
        aria-label="Dismiss notification"
      >
        <span className="text-3xl" aria-hidden="true">
          {icons[notification.type]}
        </span>
        <span className="text-lg font-semibold">
          {notification.message}
        </span>
      </button>
    </div>
  )
}
