import { LoadingSpinner } from '../LoadingSpinner'
import { BaseStyleProps } from '../types'

interface LoadingStateProps extends BaseStyleProps {
  fullScreen?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'secondary' | 'white'
}

export function LoadingState({ 
  className = '',
  fullScreen = false,
  size = 'lg',
  variant = 'primary'
}: LoadingStateProps) {
  return (
    <LoadingSpinner 
      container
      fullScreen={fullScreen}
      size={size}
      variant={variant}
      className={className}
    />
  )
} 