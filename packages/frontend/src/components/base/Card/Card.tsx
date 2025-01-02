import { cn } from '../../../utils/cn'
import { CardProps } from './types'
import { styles } from './styles'

export function Card({ 
  children, 
  className = '',
  variant = 'default',
  elevated = false,
  disabled = false,
  onClick
}: CardProps) {
  const interactive = !!onClick && !disabled

  return (
    <div
      className={cn(
        styles.base,
        styles.variants[variant as keyof typeof styles.variants],
        elevated ? styles.elevated : styles.shadow,
        interactive && styles.interactive,
        disabled && styles.disabled,
        className
      )}
      onClick={interactive ? onClick : undefined}
    >
      {children}
    </div>
  )
} 