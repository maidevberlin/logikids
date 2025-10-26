import { lazy } from 'react'
import { createHashRouter } from 'react-router-dom'
import App from '../App'

// Lazy load route features
const Welcome = lazy(() => import('../features/Welcome/WelcomePage'))
const TaskPage = lazy(() => import('../features/Task/TaskPage'))
const AccountPage = lazy(() => import('../features/Account/AccountPage'))
const StatsPage = lazy(() => import('../features/Stats/StatsPage'))
const AuthTestPage = lazy(() => import('../features/Auth/AuthTestPage').then(m => ({ default: m.AuthTestPage })))

export const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Welcome />,
      },
      {
        path: 'tasks',
        children: [
          {
            index: true,
            element: <TaskPage />,
          }
        ],
      },
      {
        path: 'account',
        element: <AccountPage />
      },
      {
        path: 'stats',
        element: <StatsPage />
      },
      {
        path: 'auth-test',
        element: <AuthTestPage />
      }
    ],
  }
]) 