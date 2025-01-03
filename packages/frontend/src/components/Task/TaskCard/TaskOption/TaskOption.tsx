import { cn } from '../../../../utils/cn'
import { TaskOptionProps } from './types'
import { styles } from './styles'

export function TaskOption({ 
  onClick, 
  label, 
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = '',
  isSelected = false,
  isCorrect = null,
  useHtml = false
}: TaskOptionProps) {
  // Determine variant based on selection and correctness
  let effectiveVariant = variant
  if (isSelected) {
    if (isCorrect === true) effectiveVariant = 'success'
    else if (isCorrect === false) effectiveVariant = 'error'
    else effectiveVariant = 'primary'
  }

  const content = useHtml ? (
    <div 
      className="prose prose-blue max-w-none"
      dangerouslySetInnerHTML={{ __html: label as string }}
    />
  ) : label

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        styles.base,
        styles.variant[effectiveVariant],
        size === 'lg' && styles.size.lg,
        disabled && styles.disabled,
        className
      )}
    >
      {content}
    </button>
  )
} 