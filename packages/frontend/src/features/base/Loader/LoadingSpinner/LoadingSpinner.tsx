import { cn } from '../../../../utils/cn'
import { LoadingSpinnerProps } from './types'
import { styles } from './styles'

export function LoadingSpinner({ 
  size = 'md',
  color = 'primary',
  className = ''
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        styles.base,
        styles.sizes[size],
        styles.variants[color],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  )
} 