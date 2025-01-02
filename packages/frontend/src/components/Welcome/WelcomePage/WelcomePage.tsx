import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import logoSrc from '../../../assets/logo.svg'
import { cn } from '../../../utils'
import { useSettings } from '../../Settings/useSettings'
import { styles } from './styles'
import type { WelcomePageProps } from './types'

export default function WelcomePage({}: WelcomePageProps) {
  const { t } = useTranslation()
  const { settings } = useSettings()

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className="flex flex-col items-center space-y-8">
          {/* Logo with animation */}
          <div className={styles.logo}>
            <img src={logoSrc} alt="LogiKids Logo" className="w-full h-full" />
          </div>

          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-blue-800">
              {settings.name 
                ? t('welcome.personalizedTitle', { name: settings.name })
                : t('welcome.title')}
            </h1>
            <p className="text-gray-600 text-lg max-w-md mx-auto">
              {settings.name 
                ? t('welcome.personalizedSubtitle')
                : t('welcome.subtitle')}
            </p>
          </div>

          <div className="flex flex-col space-y-4 w-full max-w-xs">
            <Link
              to="/tasks"
              className={styles.button.primary}
            >
              {t('welcome.startButton')}
            </Link>

            <div className="flex space-x-4">
              <Link
                to="/account"
                className={styles.button.secondary}
              >
                {settings.name ? t('account.title') : t('welcome.setupAccount')}
              </Link>

              {settings.name && (
                <Link
                  to="/stats"
                  className={styles.button.secondary}
                >
                  {t('stats.title')}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 