import { useState, useEffect } from 'react'
import { TaskOption } from './TaskOption'

interface HintDisplayProps {
  hint: string
}

function HintDisplay({ hint }: HintDisplayProps) {
  const [shouldFlash, setShouldFlash] = useState(false)

  useEffect(() => {
    setShouldFlash(true)
    const timer = setTimeout(() => setShouldFlash(false), 600)
    return () => clearTimeout(timer)
  }, [hint])

  return (
    <div className={`bg-blue-50 p-4 rounded-lg transition-colors duration-300 ${
      shouldFlash ? 'bg-blue-100' : 'bg-blue-50'
    }`}>
      <p className="text-blue-700">{hint}</p>
    </div>
  )
}

interface HintActionsProps {
  hasHint: boolean
  onRequestHint: () => void
  onSkip: () => void
}

function HintActions({ hasHint, onRequestHint, onSkip }: HintActionsProps) {
  return (
    <div className="flex gap-4">
      <TaskOption 
        onSelect={onRequestHint}
        label={hasHint ? 'Get Another Hint' : 'Get Hint'}
      />
      <TaskOption 
        onSelect={onSkip}
        label="Skip"
      />
    </div>
  )
}

interface HintSectionProps {
  hint: string | null
  onRequestHint: () => void
  onSkip: () => void
}

export function HintSection({ hint, onRequestHint, onSkip }: HintSectionProps) {
  return (
    <div className="space-y-4">
      {hint && <HintDisplay hint={hint} />}
      <HintActions 
        hasHint={Boolean(hint)}
        onRequestHint={onRequestHint}
        onSkip={onSkip}
      />
    </div>
  )
} 