import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PageLayout } from '@/ui/common'
import { ParentalConsentStep } from './ParentalConsentStep'
import { StudentInfoStep } from './StudentInfoStep'
import { StudentInfo } from './types'
import { useUserData } from '@/features/UserData'
import { LoadingState } from '@/features/base/Loader/LoadingState'

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { i18n } = useTranslation()
  const { data, isLoading, updateSettings } = useUserData()
  const [step, setStep] = useState<'consent' | 'info'>('consent')
  const [inviteCode, setInviteCode] = useState<string | null>(null)

  // Redirect to dashboard if user already has completed onboarding
  useEffect(() => {
    if (!isLoading && data?.settings?.name && data?.settings?.age && data?.settings?.grade) {
      navigate('/', { replace: true })
    }
  }, [isLoading, data, navigate])

  const handleConsent = (code: string) => {
    setInviteCode(code)
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

      // Now delete the invite code after successful account creation
      if (inviteCode) {
        try {
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5175'
          await fetch(`${apiUrl}/api/invite/validate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: inviteCode })
          })
        } catch (err) {
          console.warn('Failed to delete invite code:', err)
          // Don't block user if this fails
        }
      }

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
