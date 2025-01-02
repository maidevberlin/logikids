import { cn } from '../../../../utils/cn'
import { PageProps } from './types'
import { styles } from './styles'

export function Page({ 
  children, 
  className = '',
  background = 'white'
}: PageProps) {
  return (
    <main className={cn(
      styles.base,
      styles.variants[background],
      className
    )}>
      {children}
    </main>
  )
} 