import { LoadingSpinner } from '../LoadingSpinner'
import { LoadingStateProps } from './types'
import { cn } from '../../../../utils/cn'
import { styles } from './styles'

export function LoadingState({ 
  className = '',
  fullScreen = false,
  size = 'lg',
  variant = 'primary'
}: LoadingStateProps) {
  return (
    <div className={cn(
      styles.base,
      fullScreen && styles.fullScreen,
      className
    )}>
      <LoadingSpinner 
        size={size}
        color={variant}
      />
    </div>
  )
} 