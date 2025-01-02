import { cn } from '../../../../utils/cn'
import { HeadingProps } from './types'
import { styles } from './styles'

export function Heading({
  children,
  level = 2,
  color = 'default',
  className = ''
}: HeadingProps) {
  const Component = `h${level}` as const

  return (
    <Component
      className={cn(
        styles.levels[`h${level}`],
        styles.colors[color],
        className
      )}
    >
      {children}
    </Component>
  )
} 