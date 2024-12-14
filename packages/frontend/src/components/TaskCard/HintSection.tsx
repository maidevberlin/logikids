import { TaskOption } from './TaskOption'

interface HintSectionProps {
  hint: string | null
  onRequestHint: () => void
  onSkip: () => void
}

export function HintSection({ hint, onRequestHint, onSkip }: HintSectionProps) {
  return (
    <div className="space-y-4">
      {hint && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-700">{hint}</p>
        </div>
      )}
      <div className="flex gap-4">
        <TaskOption 
          onSelect={onRequestHint}
          label={hint ? 'Get Another Hint' : 'Get Hint'}
        />
        <TaskOption 
          onSelect={onSkip}
          label="Skip"
        />
      </div>
    </div>
  )
} 