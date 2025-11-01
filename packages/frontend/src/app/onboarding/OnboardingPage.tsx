import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PageLayout } from '@/app/common'
import { ParentalConsentStep } from './ParentalConsentStep'
import { StudentInfoStep } from './StudentInfoStep'
import { StudentInfo } from './types'
import { useUserData } from '@/app/account'
import { LoadingState } from '@/app/common'

export default function OnboardingPage() {
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
    if (data.settings?.name && data.settings?.age && data.settings?.grade) {
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
        age: info.age,
        grade: info.grade,
        language: i18n.language, // Save current language from i18n
        ...(info.gender && { gender: info.gender })
      })

      localStorage.setItem('hasSeenOnboarding', 'true')
      navigate('/')
    } catch (error) {
      console.error('Failed to update settings:', error)
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
              className={`w-3 h-3 rounded-full ${
                step === 'consent' ? 'bg-primary' : 'bg-gray-300'
              }`}
            />
            <div
              className={`w-3 h-3 rounded-full ${
                step === 'info' ? 'bg-primary' : 'bg-gray-300'
              }`}
            />
          </div>
        </div>

        {step === 'consent' && <ParentalConsentStep onConsent={handleConsent} />}
        {step === 'info' && <StudentInfoStep onComplete={handleComplete} />}
      </div>
    </PageLayout>
  )
}
