import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useUserData } from '@/app/account'
import { LoadingState } from '@/app/common'

/**
 * ProtectedRoute - Layout route that ensures user has completed onboarding
 *
 * Redirects to /welcome-choice if:
 * - Brand new user with no data at all
 *
 * Redirects to /onboarding if:
 * - User has some data but hasn't completed onboarding (missing name, age, or grade)
 *
 * Shows loading state while checking user data
 * Renders nested routes via <Outlet /> when authenticated
 */
export function ProtectedRoute() {
  const { data, isLoading } = useUserData()
  const location = useLocation()

  // Show loading state while fetching user data
  if (isLoading) {
    return <LoadingState />
  }

  // Check if this is a brand new user (no data at all)
  const isBrandNewUser = !data || Object.keys(data).length === 0

  // Redirect brand new users to welcome choice page
  if (isBrandNewUser) {
    return <Navigate to="/welcome-choice" state={{ from: location }} replace />
  }

  // Check if user has completed onboarding
  const hasCompletedOnboarding =
    data?.settings?.name && data?.settings?.age && data?.settings?.grade

  // Redirect to onboarding if started but not completed
  if (!hasCompletedOnboarding) {
    return <Navigate to="/onboarding" state={{ from: location }} replace />
  }

  // User has completed onboarding, render nested routes
  return <Outlet />
}
