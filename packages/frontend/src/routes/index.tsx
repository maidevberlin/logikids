import { RouteObject } from 'react-router-dom'
import Welcome from '../pages/Welcome'
import Learn from '../pages/Learn'
import ArithmeticTaskPage from '../pages/ArithmeticTaskPage'
import GeometryTaskPage from '../pages/GeometryTaskPage'
import App from '../App'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Welcome />,
      },
      {
        path: 'learn',
        children: [
          {
            index: true,
            element: <Learn />,
          },
          {
            path: 'arithmetic/:operation?',
            element: <ArithmeticTaskPage />,
          },
          {
            path: 'geometry/:operation?',
            element: <GeometryTaskPage />,
          },
        ],
      },
    ],
  },
] 