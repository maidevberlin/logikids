import { RouteObject } from 'react-router-dom'
import Welcome from '../pages/Welcome'
import Learn from '../pages/Learn'
import ArithmeticTask from '../pages/ArithmeticTask'
import GeometryTask from '../pages/GeometryTask'
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
            element: <ArithmeticTask />,
          },
          {
            path: 'geometry/:operation?',
            element: <GeometryTask />,
          },
        ],
      },
    ],
  },
] 