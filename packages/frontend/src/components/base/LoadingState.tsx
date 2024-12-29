import { LoadingSpinner } from '../LoadingSpinner'

export function LoadingState() {
  return (
    <div className="absolute inset-0 bg-white flex items-center justify-center rounded-xl">
      <LoadingSpinner />
    </div>
  )
} 