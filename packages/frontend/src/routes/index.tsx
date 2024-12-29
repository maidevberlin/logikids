import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import App from '../App'

// Lazy load route components
const Welcome = lazy(() => import('../pages/Welcome'))
const TaskPage = lazy(() => import('../pages/TaskPage'))

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
    ],
  },
]) 