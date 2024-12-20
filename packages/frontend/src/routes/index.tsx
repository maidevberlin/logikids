import { createBrowserRouter } from 'react-router-dom'
import Welcome from '../pages/Welcome'
import TaskPage from '../pages/TaskPage'
import App from '../App'

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