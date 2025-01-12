import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import logoSrc from '../../../assets/logikids.webp'
import { useSettings } from '../../Account/Settings/useSettings'
import { styles } from './styles'
import { Page } from '../../base/Layout'
import { cn } from '../../../utils'
import { styles as containerStyles } from '../../base/Layout/Container/styles'
import type { WelcomePageProps } from './types'

export default function WelcomePage({}: WelcomePageProps) {
  const { t } = useTranslation()
  const { settings } = useSettings()

  return (
    <Page navigation={null} background="gradient">
      <div className={styles.container}>
        <div className={cn(
          containerStyles.base,
          containerStyles.sizes.lg,
          styles.content
        )}>
          {/* Logo with animation */}
          <div className={styles.logo.wrapper}>
            <img 
              src={logoSrc} 
              alt="LogiKids Logo" 
              className={styles.logo.image}
            />
          </div>

          <div className={styles.text.wrapper}>
            <h1 className={styles.text.title}>
              {settings.name 
                ? t('welcome.personalizedTitle', { name: settings.name })
                : t('welcome.title')}
            </h1>
            <p className={styles.text.subtitle}>
              {settings.name 
                ? t('welcome.personalizedSubtitle')
                : t('welcome.subtitle')}
            </p>
          </div>

          <div className={styles.buttons.wrapper}>
            <Link
              to="/tasks"
              className={styles.buttons.primary}
            >
              {t('welcome.startButton')}
            </Link>

            <div className={styles.buttons.group}>
              <Link
                to="/account"
                className={styles.buttons.secondary}
              >
                {settings.name ? t('account.title') : t('welcome.setupAccount')}
              </Link>

              {settings.name && (
                <Link
                  to="/stats"
                  className={styles.buttons.secondary}
                >
                  {t('stats.title')}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </Page>
  )
} 