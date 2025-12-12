import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PageLayout } from '@/app/common/PageLayout'
import { ParentalConsentStep } from './ParentalConsentStep'
import { StudentInfoStep } from './StudentInfoStep'
import { StudentInfo } from './types'
import { useUserData } from '@/app/user'
import { LoadingState } from '@/app/common'
import { createLogger } from '@/app/common/logger'
import { Language, DEFAULT_LANGUAGE } from '@content/schema'

const logger = createLogger('OnboardingPage')

export function OnboardingPage() {
  const navigate = useNavigate()
  const { i18n } = useTranslation()
  const { data, isLoading, updateSettings } = useUserData()
  const [step, setStep] = useState<'consent' | 'info'>('consent')

  // Redirect logic
  useEffect(() => {
    if (isLoading) return

    // No user data at all? User bypassed welcome-choice, send them back
    if (!data) {
      navigate('/welcome-choice', { replace: true })
      return
    }

    // User data exists and onboarding is complete? Go to main app
    if (data.settings?.name && data.settings?.grade) {
      navigate('/', { replace: true })
    }
  }, [isLoading, data, navigate])

  const handleConsent = () => {
    setStep('info')
  }

  const handleComplete = async (info: StudentInfo) => {
    try {
      await updateSettings({
        name: info.name,
        grade: info.grade,
        language: (i18n.language as Language) || DEFAULT_LANGUAGE, // Save current language from i18n
      })

      localStorage.setItem('hasSeenOnboarding', 'true')
      navigate('/')
    } catch (error) {
      logger.error('Failed to update settings', error as Error)
      // TODO: Show error toast/message
    }
  }

  // Show loading state while checking if user has completed onboarding
  if (isLoading) {
    return <LoadingState />
  }

  return (
    <PageLayout>
      <div className="py-12">
        {/* Progress indicator */}
        <div className="max-w-md mx-auto mb-8">
          <div className="flex items-center justify-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${step === 'consent' ? 'bg-primary' : 'bg-muted'}`}
            />
            <div
              className={`w-3 h-3 rounded-full ${step === 'info' ? 'bg-primary' : 'bg-muted'}`}
            />
          </div>
        </div>

        {step === 'consent' && <ParentalConsentStep onConsent={handleConsent} />}
        {step === 'info' && <StudentInfoStep onComplete={handleComplete} />}
      </div>
    </PageLayout>
  )
}
