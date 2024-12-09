interface HintSectionProps {
  hint: string | null;
  onRequestHint: () => void;
  onSkip: () => void;
}

export function HintSection({ hint, onRequestHint, onSkip }: HintSectionProps) {
  return (
    <div className="mt-6">
      {hint ? (
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-700">{hint}</p>
        </div>
      ) : (
        <div className="flex gap-4">
          <button
            onClick={onRequestHint}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Get Hint
          </button>
          <button
            onClick={onSkip}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            Skip
          </button>
        </div>
      )}
    </div>
  );
} 