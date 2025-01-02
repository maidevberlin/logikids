import { motion } from 'framer-motion'
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
  animate = true,
  className = ''
}: FeedbackProps) {
  const config = variantConfig[variant]
  const Icon = config.icon

  const content = (
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

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
      >
        {content}
      </motion.div>
    )
  }

  return content
} 