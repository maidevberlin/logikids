import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import logoSrc from '../../../assets/logikids.webp'
import { useUserData } from '../../UserData'
import { styles } from './styles'
import { Page } from '../../base/Layout'
import { cn } from '../../../utils'
import { styles as containerStyles } from '../../base/Layout/Container/styles'
import type { WelcomePageProps } from './types'

export default function WelcomePage({}: WelcomePageProps) {
  const { t } = useTranslation()
  const { data, isLoading, updateSettings } = useUserData()
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardingName, setOnboardingName] = useState('')
  const [onboardingGrade, setOnboardingGrade] = useState(6)
  const [isCreating, setIsCreating] = useState(false)

  // Show onboarding if user has no name
  useEffect(() => {
    if (!isLoading && !data?.settings.name) {
      const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding')
      if (!hasSeenOnboarding) {
        setShowOnboarding(true)
      }
    }
  }, [isLoading, data?.settings.name])

  const handleCreateAccount = async () => {
    if (!onboardingName) return

    setIsCreating(true)
    try {
      await updateSettings({ name: onboardingName, grade: onboardingGrade })
      setShowOnboarding(false)
      localStorage.setItem('hasSeenOnboarding', 'true')
    } catch (error) {
      console.error('Failed to update settings:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleSkipOnboarding = () => {
    setShowOnboarding(false)
    localStorage.setItem('hasSeenOnboarding', 'true')
  }

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
              {data?.settings.name
                ? t('welcome.personalizedTitle', { name: data.settings.name })
                : t('welcome.title')}
            </h1>
            <p className={styles.text.subtitle}>
              {data?.settings.name
                ? t('welcome.personalizedSubtitle')
                : t('welcome.subtitle')}
            </p>
          </div>

          {/* Onboarding Modal */}
          {showOnboarding && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {t('welcome.onboarding.title', { defaultValue: 'Create a Secure Account' })}
                </h2>
                <p className="text-sm text-gray-600">
                  {t('welcome.onboarding.description', {
                    defaultValue: 'Create an account to save your progress securely across devices. Your data is encrypted and private.'
                  })}
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('account.settings.name', { defaultValue: 'Name' })}
                    </label>
                    <input
                      type="text"
                      value={onboardingName}
                      onChange={(e) => setOnboardingName(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={t('welcome.onboarding.namePlaceholder', { defaultValue: 'Enter your name' })}
                      disabled={isCreating}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('account.settings.grade', { defaultValue: 'Grade' })}
                    </label>
                    <input
                      type="number"
                      value={onboardingGrade}
                      onChange={(e) => setOnboardingGrade(parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                      max="13"
                      disabled={isCreating}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSkipOnboarding}
                    disabled={isCreating}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    {t('welcome.onboarding.skip', { defaultValue: 'Skip' })}
                  </button>
                  <button
                    onClick={handleCreateAccount}
                    disabled={!onboardingName || isCreating}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreating
                      ? t('welcome.onboarding.creating', { defaultValue: 'Creating...' })
                      : t('welcome.onboarding.create', { defaultValue: 'Create Account' })}
                  </button>
                </div>
              </div>
            </div>
          )}

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
                {data?.settings.name ? t('account.title') : t('welcome.setupAccount')}
              </Link>

              {data?.settings.name && (
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