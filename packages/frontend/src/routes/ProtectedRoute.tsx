import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useUserData } from '@/app/account'
import { LoadingState } from '@/app/common'

/**
 * ProtectedRoute - Layout route that ensures user has completed onboarding
 *
 * Redirects to /onboarding if:
 * - User data doesn't exist
 * - User settings are missing required fields (name, age, grade)
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

  // Check if user has completed onboarding
  const hasCompletedOnboarding =
    data?.settings?.name &&
    data?.settings?.age &&
    data?.settings?.grade

  // Redirect to onboarding if not completed
  if (!hasCompletedOnboarding) {
    return <Navigate to="/onboarding" state={{ from: location }} replace />
  }

  // User has completed onboarding, render nested routes
  return <Outlet />
}
