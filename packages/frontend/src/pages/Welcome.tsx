import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import logoSrc from '../logo.svg'
import { cn } from '../components/base/styles/utils'
import { interactive, container } from '../components/base/styles/common'
import { useSettings } from '../hooks/useSettings'

export default function Welcome() {
  const { t } = useTranslation()
  const { settings } = useSettings()

  return (
    <div className={cn(
      'flex flex-col items-center justify-center min-h-screen',
      'p-4 bg-gradient-to-b from-blue-50 to-blue-100'
    )}>
      <div className={cn(
        container.maxWidth.md,
        'bg-white p-8 rounded-xl shadow-xl w-full',
        'transform transition-all duration-300 hover:scale-102'
      )}>
        <div className="flex flex-col items-center space-y-8">
          {/* Logo with animation */}
          <div className={cn(
            'w-64 h-40 mb-4',
            'transform transition-all duration-500',
            'hover:scale-105'
          )}>
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
              className={cn(
                'inline-flex items-center justify-center px-6 py-3',
                'text-base font-medium rounded-md',
                'text-white bg-primary-600',
                'transform transition-all duration-200',
                interactive.hover.opacity,
                interactive.focus
              )}
            >
              {t('welcome.startButton')}
            </Link>

            <div className="flex space-x-4">
              <Link
                to="/account"
                className={cn(
                  'flex-1 inline-flex items-center justify-center px-4 py-2',
                  'text-sm font-medium rounded-md',
                  'text-primary-600 bg-white border-2 border-primary-600',
                  'transform transition-all duration-200',
                  interactive.hover.opacity,
                  interactive.focus
                )}
              >
                {settings.name ? t('account.title') : t('welcome.setupAccount')}
              </Link>

              {settings.name && (
                <Link
                  to="/stats"
                  className={cn(
                    'flex-1 inline-flex items-center justify-center px-4 py-2',
                    'text-sm font-medium rounded-md',
                    'text-primary-600 bg-white border-2 border-primary-600',
                    'transform transition-all duration-200',
                    interactive.hover.opacity,
                    interactive.focus
                  )}
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