interface ErrorDisplayProps {
  message: string
}

export function ErrorDisplay({ message }: ErrorDisplayProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-red-600">{message}</div>
    </div>
  )
} 