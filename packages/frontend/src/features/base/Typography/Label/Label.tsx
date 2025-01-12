import { cn } from '../../../../utils/cn'
import { LabelProps } from './types'
import { styles } from './styles'

export function Label({
  children,
  htmlFor,
  required = false,
  className = ''
}: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(styles.base, className)}
    >
      {children}
      {required && (
        <span 
          className={styles.required}
          aria-hidden="true"
        >
          *
        </span>
      )}
    </label>
  )
} 