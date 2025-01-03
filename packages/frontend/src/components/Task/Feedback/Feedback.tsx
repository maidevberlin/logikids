import { 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import { cn } from '../../../utils/cn'
import { FeedbackProps } from './types'
import { styles } from './styles'

const variantConfig = {
  success: {
    icon: CheckCircleIcon,
  },
  error: {
    icon: XCircleIcon,
  },
  warning: {
    icon: ExclamationTriangleIcon,
  },
  info: {
    icon: InformationCircleIcon,
  }
}

export function Feedback({ 
  message,
  variant,
  showIcon = true,
  className = ''
}: FeedbackProps) {
  const config = variantConfig[variant]
  const Icon = config.icon

  return (
    <div 
      className={cn(
        styles.base,
        styles.variant[variant],
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <div className={styles.content}>
        {showIcon && (
          <Icon className={cn(styles.icon.base, styles.icon[variant])} />
        )}
        <p className={styles.message}>
          {message}
        </p>
      </div>
    </div>
  )
} 