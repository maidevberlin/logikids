import { lazy } from 'react'
import { createHashRouter, createRoutesFromElements, Route } from 'react-router-dom'
import { App } from '../App'
import { ProtectedRoute } from './ProtectedRoute'

// Lazy load UI pages
const WelcomePage = lazy(() => import('@/app/welcome').then((m) => ({ default: m.WelcomePage })))
const WelcomeChoicePage = lazy(() =>
  import('@/app/welcome-choice').then((m) => ({ default: m.WelcomeChoicePage }))
)
const OnboardingPage = lazy(() =>
  import('@/app/onboarding').then((m) => ({ default: m.OnboardingPage }))
)
const SubjectsPage = lazy(() => import('@/app/subjects').then((m) => ({ default: m.SubjectsPage })))
const ConceptsPage = lazy(() => import('@/app/concepts').then((m) => ({ default: m.ConceptsPage })))
const AccountPage = lazy(() => import('@/app/account').then((m) => ({ default: m.AccountPage })))
const TaskPage = lazy(() => import('@/app/tasks').then((m) => ({ default: m.TaskPage })))
const StatsPage = lazy(() => import('@/app/stats').then((m) => ({ default: m.StatsPage })))
const PracticePage = lazy(() =>
  import('@/app/practice/PracticePage').then((m) => ({ default: m.PracticePage }))
)
const PrivacyPage = lazy(() =>
  import('@/app/legal/PrivacyPage').then((m) => ({ default: m.PrivacyPage }))
)
const ImpressumPage = lazy(() =>
  import('@/app/legal/ImpressumPage').then((m) => ({ default: m.ImpressumPage }))
)

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
        <Route path="practice" element={<PracticePage />} />
      </Route>
    </Route>
  )
)
