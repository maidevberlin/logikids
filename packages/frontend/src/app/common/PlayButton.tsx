import { useTTS } from './useTTS'
import { useTTSCostReporter } from '@/app/tasks/TTSCostContext'
import { Volume2, Loader2 } from 'lucide-react'
import { Button } from '@/app/common/ui/button'
import { cn } from '@/app/common/cn'

interface PlayButtonProps {
  taskId: string
  field: string
  className?: string
}

/**
 * PlayButton component for Text-to-Speech
 *
 * Displays a speaker icon button that plays audio for a specific task field.
 * Shows different visual states: idle (speaker), loading (spinner), playing (animated).
 *
 * @param taskId - The task ID
 * @param field - The field to play (e.g., "task", "explanation", "options:0", "hint:1")
 * @param className - Optional additional CSS classes
 */
export function PlayButton({ taskId, field, className }: PlayButtonProps) {
  const reportCost = useTTSCostReporter()
  const { state, play } = useTTS({ taskId, field, onCostReceived: reportCost })

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering parent click handlers
    play()
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={state === 'loading'}
      className={cn('h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-700', className)}
      aria-label={`Play audio for ${field}`}
    >
      {state === 'loading' ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Volume2
          className={cn(
            'w-4 h-4 transition-all',
            state === 'playing' && 'text-blue-600 animate-pulse scale-110'
          )}
        />
      )}
    </Button>
  )
}
