import { lazy } from 'react'
import { createHashRouter } from 'react-router-dom'
import App from '../App'

// Lazy load new UI pages
const WelcomePage = lazy(() => import('../ui/welcome'))
const OnboardingPage = lazy(() => import('../ui/onboarding'))
const SubjectsPage = lazy(() => import('../ui/subjects'))
const ConceptsPage = lazy(() => import('../ui/concepts'))
const AccountPage = lazy(() => import('../ui/account'))

// Lazy load existing features
const TaskPage = lazy(() => import('../features/Task/TaskPage'))
const StatsPage = lazy(() => import('../features/Stats/StatsPage'))

export const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <WelcomePage />,
      },
      {
        path: 'onboarding',
        element: <OnboardingPage />
      },
      {
        path: 'subjects',
        children: [
          {
            index: true,
            element: <SubjectsPage />,
          },
          {
            path: ':subject',
            children: [
              {
                index: true,
                element: <ConceptsPage />,
              },
              {
                path: ':concept/tasks',
                element: <TaskPage />
              }
            ]
          }
        ]
      },
      {
        path: 'account',
        element: <AccountPage />
      },
      {
        path: 'stats',
        element: <StatsPage />
      }
    ],
  }
]) 