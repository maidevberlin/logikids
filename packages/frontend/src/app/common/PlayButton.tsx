import { useTTS } from './useTTS'
import { useTTSCostReporter } from '@/app/tasks/TTSCostContext'
import { Volume2, Loader2, Pause } from 'lucide-react'
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
 * Shows different visual states: idle (speaker), loading (spinner), playing (pause icon).
 * Clicking while playing will stop the audio.
 *
 * @param taskId - The task ID
 * @param field - The field to play (e.g., "task", "explanation", "options:0", "hint:1")
 * @param className - Optional additional CSS classes
 */
export function PlayButton({ taskId, field, className }: PlayButtonProps) {
  const reportCost = useTTSCostReporter()
  const { state, play, stop } = useTTS({ taskId, field, onCostReceived: reportCost })

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering parent click handlers
    if (state === 'playing') {
      stop()
    } else {
      play()
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={state === 'loading'}
      className={cn('h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-700', className)}
      aria-label={state === 'playing' ? `Stop audio for ${field}` : `Play audio for ${field}`}
    >
      {state === 'loading' ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : state === 'playing' ? (
        <Pause className="w-4 h-4 text-blue-600" />
      ) : (
        <Volume2 className="w-4 h-4 transition-all" />
      )}
    </Button>
  )
}
