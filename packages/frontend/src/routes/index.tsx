import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import App from '../App'

// Lazy load route components
const Welcome = lazy(() => import('../components/Welcome/WelcomePage'))
const TaskPage = lazy(() => import('../components/Task/TaskPage'))
const AccountPage = lazy(() => import('../components/Account/AccountPage'))
const StatsPage = lazy(() => import('../components/Stats/StatsPage'))

export const router = createBrowserRouter([
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
      }
    ],
  }
]) 