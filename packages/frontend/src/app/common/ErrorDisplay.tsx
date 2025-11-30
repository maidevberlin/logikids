import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  FaceFrownIcon,
  ArrowPathIcon,
  HomeIcon,
  ExclamationTriangleIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline'
import { Alert, AlertDescription, AlertTitle } from '@/app/common/ui/alert.tsx'
import { Button } from '@/app/common/ui/button.tsx'

export type ErrorSeverity = 'error' | 'warning' | 'fatal'

export interface ErrorAction {
  label: string
  onClick: () => void
  icon?: typeof HomeIcon
}

export interface ErrorDisplayProps {
  message: string
  details?: string
  onRetry?: () => void
  isLoading?: boolean
  standalone?: boolean
  severity?: ErrorSeverity
  showHomeButton?: boolean
  action?: ErrorAction
  className?: string
}

const severityConfig: Record<ErrorSeverity, {
  icon: typeof FaceFrownIcon
  variant: 'default' | 'destructive'
}> = {
  error: {
    icon: FaceFrownIcon,
    variant: 'destructive',
  },
  warning: {
    icon: ExclamationTriangleIcon,
    variant: 'default',
  },
  fatal: {
    icon: ShieldExclamationIcon,
    variant: 'destructive',
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
  action,
  className
}: ErrorDisplayProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const config = severityConfig[severity]
  const Icon = config.icon

  const content = (
    <div className="space-y-4">
      <Alert variant={config.variant} className={className}>
        <Icon className="h-5 w-5" />
        <AlertTitle className="text-lg">{message}</AlertTitle>
        {details && (
          <AlertDescription className="mt-2 text-sm opacity-90">
            <pre className="whitespace-pre-wrap break-words font-mono text-xs">
              {details}
            </pre>
          </AlertDescription>
        )}
      </Alert>

      <div className="flex flex-col gap-3">
        {onRetry && (
          <Button
            onClick={onRetry}
            disabled={isLoading}
            className="w-full"
          >
            <ArrowPathIcon className={`h-5 w-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? t('common.loading') : t('error.tryAgain')}
          </Button>
        )}

        {action && (
          <Button
            onClick={action.onClick}
            disabled={isLoading}
            className="w-full"
          >
            {action.icon && <action.icon className="h-5 w-5 mr-2" />}
            {action.label}
          </Button>
        )}

        {showHomeButton && (
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            disabled={isLoading}
            className="w-full"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            {t('error.backToHome')}
          </Button>
        )}
      </div>
    </div>
  )

  if (standalone) {
    return (
      <div className="error-page">
        <div className="max-w-2xl mx-auto p-8">
          {content}
        </div>
      </div>
    )
  }

  return content
}
