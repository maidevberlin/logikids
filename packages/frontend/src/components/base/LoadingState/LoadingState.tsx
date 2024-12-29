import { LoadingSpinner } from '../LoadingSpinner'
import { BaseStyleProps } from '../types'

interface LoadingStateProps extends BaseStyleProps {
  fullScreen?: boolean
}

export function LoadingState({ 
  className = '',
  fullScreen = false 
}: LoadingStateProps) {
  return (
    <div className={`
      ${fullScreen ? 'fixed inset-0 z-50' : 'absolute inset-0'} 
      bg-white flex items-center justify-center rounded-xl
      ${className}
    `}>
      <LoadingSpinner size="lg" />
    </div>
  )
} 