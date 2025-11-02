import { lazy } from 'react'
import { createHashRouter, createRoutesFromElements, Route } from 'react-router-dom'
import App from '../App'
import { ProtectedRoute } from './ProtectedRoute'

// Lazy load UI pages
const WelcomePage = lazy(() => import('@/app/welcome'))
const WelcomeChoicePage = lazy(() => import('@/app/welcome-choice'))
const OnboardingPage = lazy(() => import('@/app/onboarding'))
const SubjectsPage = lazy(() => import('@/app/subjects'))
const ConceptsPage = lazy(() => import('@/app/concepts'))
const AccountPage = lazy(() => import('@/app/account'))
const TaskPage = lazy(() => import('@/app/tasks'))
const StatsPage = lazy(() => import('@/app/stats').then(m => ({ default: m.StatsPage })))
const PrivacyPage = lazy(() => import('@/app/legal/PrivacyPage'))
const ImpressumPage = lazy(() => import('@/app/legal/ImpressumPage'))

export const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Public routes */}
      <Route path="welcome-choice" element={<WelcomeChoicePage />} />
      <Route path="onboarding" element={<OnboardingPage />} />
      <Route path="privacy" element={<PrivacyPage />} />
      <Route path="impressum" element={<ImpressumPage />} />

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