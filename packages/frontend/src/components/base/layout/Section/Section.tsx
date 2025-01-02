import { cn } from '../../../../utils/cn'
import { SectionProps } from './types'
import { styles } from './styles'

export function Section({ 
  children, 
  className = '',
  size = 'md'
}: SectionProps) {
  return (
    <section className={cn(
      styles.sizes[size],
      className
    )}>
      {children}
    </section>
  )
} 