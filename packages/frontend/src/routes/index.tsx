import { lazy } from 'react'
import { createHashRouter, createRoutesFromElements, Route } from 'react-router-dom'
import App from '../App'
import { ProtectedRoute } from './ProtectedRoute'

// Lazy load new UI pages
const WelcomePage = lazy(() => import('../ui/welcome'))
const OnboardingPage = lazy(() => import('../ui/onboarding'))
const SubjectsPage = lazy(() => import('../ui/subjects'))
const ConceptsPage = lazy(() => import('../ui/concepts'))
const AccountPage = lazy(() => import('../ui/account'))

// Lazy load existing features
const TaskPage = lazy(() => import('../features/Task/TaskPage'))
const StatsPage = lazy(() => import('../features/Stats/StatsPage'))

export const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Public route */}
      <Route path="onboarding" element={<OnboardingPage />} />

      {/* All protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route index element={<WelcomePage />} />

        <Route path="subjects">
          <Route index element={<SubjectsPage />} />
          <Route path=":subject">
            <Route index element={<ConceptsPage />} />
            <Route path=":concept/tasks" element={<TaskPage />} />
          </Route>
        </Route>

        <Route path="account" element={<AccountPage />} />
        <Route path="stats" element={<StatsPage />} />
      </Route>
    </Route>
  )
) 