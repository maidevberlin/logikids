interface FeedbackMessageProps {
  isCorrect: boolean,
  onRequestHint?: () => void
}

export function FeedbackMessage({ isCorrect }: FeedbackMessageProps) {
  return (
    <div
      className={`mt-6 p-4 rounded-lg text-lg ${
        isCorrect ? 'bg-green-50 text-green-800' : 'bg-blue-50 text-blue-800'
      }`}
      role="alert"
      aria-live="polite"
    >
      <p className="font-medium">
        {isCorrect ? (
          'Correct! Well done!'
        ) : (
          'Not quite right. Try another answer!'
        )}
      </p>
    </div>
  )
} 