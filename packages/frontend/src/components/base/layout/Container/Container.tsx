import { cn } from '../../../../utils/cn'
import { ContainerProps } from './types'
import { styles } from './styles'

export function Container({ 
  children, 
  maxWidth = 'lg',
  className = '' 
}: ContainerProps) {
  return (
    <div className={cn(
      styles.base,
      styles.sizes[maxWidth],
      className
    )}>
      {children}
    </div>
  )
} 