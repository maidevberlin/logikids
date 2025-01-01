import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { 
  FaceFrownIcon, 
  ArrowPathIcon, 
  HomeIcon,
  ExclamationTriangleIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline'
import { Card } from '../Card/Card'
import { Text } from '../Typography/Text'
import { Button } from '../Button/Button'
import { cn } from '../styles/utils'

export type ErrorSeverity = 'error' | 'warning' | 'fatal'

interface ErrorDisplayProps {
  /** The error message to display */
  message: string
  /** Optional error details (like stack trace) */
  details?: string
  /** Callback for retry action */
  onRetry?: () => void
  /** Whether the retry action is in progress */
  isLoading?: boolean
  /** If true, wraps the error in a full-screen centered layout with a Card */
  standalone?: boolean
  /** The severity of the error */
  severity?: ErrorSeverity
  /** Whether to show the home button */
  showHomeButton?: boolean
  /** Custom action button */
  action?: {
    label: string
    onClick: () => void
    icon?: React.ComponentType<React.ComponentProps<'svg'>>
  }
}

const severityConfig = {
  error: {
    icon: FaceFrownIcon,
    iconClass: 'text-error-400',
    cardVariant: 'error' as const,
    gradient: 'from-error-50 to-error-100',
  },
  warning: {
    icon: ExclamationTriangleIcon,
    iconClass: 'text-warning-400',
    cardVariant: 'warning' as const,
    gradient: 'from-warning-50 to-warning-100',
  },
  fatal: {
    icon: ShieldExclamationIcon,
    iconClass: 'text-error-600',
    cardVariant: 'error' as const,
    gradient: 'from-error-100 to-error-200',
  },
}

export function ErrorDisplay({ 
  message, 
  details,
  onRetry, 
  isLoading = false,
  standalone = false,
  severity = 'error',
  showHomeButton = true,
  action
}: ErrorDisplayProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const config = severityConfig[severity]
  const Icon = config.icon

  const content = (
    <div className="text-center space-y-6">
      <Icon className={cn('h-16 w-16 mx-auto', config.iconClass)} />
      <div className="space-y-2">
        <Text size="lg" color="error" className="font-semibold">{message}</Text>
        {details && (
          <Text size="sm" color="muted" className="font-mono break-all">
            {details}
          </Text>
        )}
      </div>
      
      <div className="flex flex-col gap-4">
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="primary"
            fullWidth
            disabled={isLoading}
          >
            <span className="inline-flex items-center gap-2">
              <ArrowPathIcon className={cn('h-6 w-6', isLoading && 'animate-spin')} />
              {isLoading ? t('common.loading') : t('error.tryAgain')}
            </span>
          </Button>
        )}

        {action && (
          <Button
            onClick={action.onClick}
            variant="primary"
            fullWidth
            disabled={isLoading}
          >
            <span className="inline-flex items-center gap-2">
              {action.icon && <action.icon className="h-6 w-6" />}
              {action.label}
            </span>
          </Button>
        )}
        
        {showHomeButton && (
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            fullWidth
            disabled={isLoading}
          >
            <span className="inline-flex items-center gap-2">
              <HomeIcon className="h-6 w-6" />
              {t('error.backToHome')}
            </span>
          </Button>
        )}
      </div>
    </div>
  )

  if (standalone) {
    return (
      <div className={cn(
        'min-h-screen flex items-center justify-center p-4',
        'bg-gradient-to-b',
        config.gradient
      )}>
        <Card 
          variant={config.cardVariant} 
          elevated 
          className="p-8 max-w-md mx-auto"
        >
          {content}
        </Card>
      </div>
    )
  }

  return content
} 