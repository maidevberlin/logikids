import { ReactNode } from 'react'
import { cn } from '../../../../utils/cn'
import { styles } from './styles'

export interface FormFieldProps {
  label: string
  children: ReactNode
  error?: string
  className?: string
}

export function FormField({ label, children, error, className }: FormFieldProps) {
  return (
    <div className={cn(styles.container, className)}>
      <label className={styles.label}>{label}</label>
      {children}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  )
} 