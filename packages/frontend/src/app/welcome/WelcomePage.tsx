import { PageLayout } from '@/app/common'
import { GreetingHeader } from './GreetingHeader'
import { NavigationCards } from './NavigationCards'
import { useUserData } from '@/app/account'
import logoSrc from '@/assets/logikids.webp'

export default function WelcomePage() {
  const { data } = useUserData()

  // ProtectedRoute ensures data.settings.name exists
  // No need for additional checks or redirects here

  return (
    <PageLayout showHeader={false}>
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
        <GreetingHeader name={data!.settings.name} />

        {/* Navigation Cards */}
        <NavigationCards />
      </div>
    </PageLayout>
  )
}
