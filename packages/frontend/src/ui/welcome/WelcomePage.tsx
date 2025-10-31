import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout } from '@/ui/common'
import { GreetingHeader } from './GreetingHeader'
import { NavigationCards } from './NavigationCards'
import { useUserData } from '@/features/UserData'
import logoSrc from '@/assets/logikids.webp'

export default function WelcomePage() {
  const navigate = useNavigate()
  const { data, isLoading } = useUserData()

  // Redirect to onboarding if user has no name
  useEffect(() => {
    if (!isLoading && !data?.settings.name) {
      const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding')
      if (!hasSeenOnboarding) {
        navigate('/onboarding')
      }
    }
  }, [isLoading, data?.settings.name, navigate])

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </PageLayout>
    )
  }

  // Don't render if no name (will redirect to onboarding)
  if (!data?.settings.name) {
    return null
  }

  return (
    <PageLayout>
      <div className="min-h-screen flex flex-col items-center justify-center py-12">
        {/* Logo */}
        <div className="mb-12">
          <img
            src={logoSrc}
            alt="LogiKids Logo"
            className="w-32 h-32 mx-auto drop-shadow-lg"
          />
        </div>

        {/* Greeting */}
        <GreetingHeader name={data.settings.name} />

        {/* Navigation Cards */}
        <NavigationCards />
      </div>
    </PageLayout>
  )
}
