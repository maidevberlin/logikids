import { cn } from '../../../../utils/cn'
import { TextProps } from './types'
import { styles } from './styles'

export function Text({
  children,
  size = 'base',
  weight = 'normal',
  color = 'default',
  className = '',
  as: Component = 'p',
  htmlFor
}: TextProps) {
  return (
    <Component
      className={cn(
        styles.sizes[size],
        styles.weights[weight],
        styles.colors[color],
        className
      )}
      {...(htmlFor ? { htmlFor } : {})}
    >
      {children}
    </Component>
  )
} 