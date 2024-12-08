interface HintSectionProps {
  hint: { hint: string } | null
  onRequestHint: () => void
  onSkip: () => void
}

export function HintSection({ hint, onRequestHint, onSkip }: HintSectionProps) {
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center">
        <button
          onClick={onRequestHint}
          className="text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Need a hint?
        </button>
        <button
          onClick={onSkip}
          className="text-gray-500 hover:text-gray-700 font-medium text-sm"
        >
          Skip this task &rarr;
        </button>
      </div>
      {hint && (
        <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
          <p className="text-gray-800">{hint.hint}</p>
        </div>
      )}
    </div>
  )
} 