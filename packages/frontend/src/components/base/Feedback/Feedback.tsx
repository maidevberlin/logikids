import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import { cn } from '../styles/utils'

export type FeedbackVariant = 'success' | 'error' | 'warning' | 'info'

interface FeedbackProps {
  /** The message to display */
  message: string
  /** The variant of the feedback */
  variant: FeedbackVariant
  /** Whether to show the icon */
  showIcon?: boolean
  /** Whether to animate the feedback */
  animate?: boolean
  /** Additional CSS classes */
  className?: string
}

const variantConfig = {
  success: {
    icon: CheckCircleIcon,
    bgColor: 'bg-success-50',
    textColor: 'text-success-800',
    iconColor: 'text-success-400',
    borderColor: 'border-success-200'
  },
  error: {
    icon: XCircleIcon,
    bgColor: 'bg-error-50',
    textColor: 'text-error-800',
    iconColor: 'text-error-400',
    borderColor: 'border-error-200'
  },
  warning: {
    icon: ExclamationTriangleIcon,
    bgColor: 'bg-warning-50',
    textColor: 'text-warning-800',
    iconColor: 'text-warning-400',
    borderColor: 'border-warning-200'
  },
  info: {
    icon: InformationCircleIcon,
    bgColor: 'bg-info-50',
    textColor: 'text-info-800',
    iconColor: 'text-info-400',
    borderColor: 'border-info-200'
  }
}

export function Feedback({ 
  message,
  variant,
  showIcon = true,
  animate = true,
  className = ''
}: FeedbackProps) {
  const { t } = useTranslation()
  const config = variantConfig[variant]
  const Icon = config.icon

  const content = (
    <div 
      className={cn(
        'p-4 rounded-lg border',
        config.bgColor,
        config.textColor,
        config.borderColor,
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex gap-3">
        {showIcon && (
          <Icon className={cn('h-5 w-5 flex-shrink-0', config.iconColor)} />
        )}
        <p className="font-medium">
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