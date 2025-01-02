import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { 
  FaceFrownIcon, 
  ArrowPathIcon, 
  HomeIcon,
  ExclamationTriangleIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline'
import { Card } from '../../Card'
import { Text } from '../../Typography/Text'
import { Button } from '../../Button'
import { cn } from '../../../../utils/cn'
import { ErrorDisplayProps, ErrorSeverity } from './types'
import { styles } from './styles'
import { useSpin } from '../../Animations'

const severityConfig: Record<ErrorSeverity, {
  icon: typeof FaceFrownIcon
  iconClass: keyof typeof styles.icon.variants
  cardVariant: 'error' | 'warning'
  gradient: keyof typeof styles.standalone.gradients
}> = {
  error: {
    icon: FaceFrownIcon,
    iconClass: 'error',
    cardVariant: 'error',
    gradient: 'error',
  },
  warning: {
    icon: ExclamationTriangleIcon,
    iconClass: 'warning',
    cardVariant: 'warning',
    gradient: 'warning',
  },
  fatal: {
    icon: ShieldExclamationIcon,
    iconClass: 'fatal',
    cardVariant: 'error',
    gradient: 'fatal',
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
  const [isSpinning, startSpin, stopSpin] = useSpin()

  // Start/stop spinning based on loading state
  useEffect(() => {
    if (isLoading) {
      startSpin()
    } else {
      stopSpin()
    }
  }, [isLoading, startSpin, stopSpin])

  const content = (
    <div className={cn(styles.content, className)}>
      <Icon className={cn(styles.icon.base, styles.icon.variants[config.iconClass])} />
      <div className={styles.message}>
        <Text size="lg" color="error" className="font-semibold">{message}</Text>
        {details && (
          <Text size="sm" color="muted" className={styles.details}>
            {details}
          </Text>
        )}
      </div>
      
      <div className={styles.actions}>
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="primary"
            fullWidth
            disabled={isLoading}
          >
            <span className={styles.button.content}>
              <ArrowPathIcon className={cn(styles.button.icon, isSpinning && 'animate-spin')} />
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
            <span className={styles.button.content}>
              {action.icon && <action.icon className={styles.button.icon} />}
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
            <span className={styles.button.content}>
              <HomeIcon className={styles.button.icon} />
              {t('error.backToHome')}
            </span>
          </Button>
        )}
      </div>
    </div>
  )

  if (standalone) {
    return (
      <div className={cn(styles.standalone.base, styles.standalone.gradients[config.gradient])}>
        <Card 
          variant={config.cardVariant} 
          elevated 
          className={styles.card}
        >
          {content}
        </Card>
      </div>
    )
  }

  return content
} 