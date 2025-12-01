import { PageLayout } from '@/app/common/PageLayout'
import { GreetingHeader } from './GreetingHeader'
import { StatsHeader } from './StatsHeader'
import { NavigationCards } from './NavigationCards'
import { useUserData } from '@/app/account'

export function WelcomePage() {
  const { data } = useUserData()

  // ProtectedRoute ensures data.settings.name exists
  // No need for additional checks or redirects here

  return (
    <PageLayout showAccount>
      <div className="min-h-screen flex flex-col items-center pt-8 pb-12 px-4">
        <div className="w-full max-w-5xl space-y-8">
          {/* Greeting */}
          <GreetingHeader name={data!.settings.name} />

          {/* Stats Header */}
          <StatsHeader />

          {/* Navigation Cards */}
          <NavigationCards />
        </div>
      </div>
    </PageLayout>
  )
}
