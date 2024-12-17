import { RouteObject } from 'react-router-dom'
import Welcome from '../pages/Welcome'
import Learn from '../pages/Learn'
import ArithmeticTaskPage from '../pages/ArithmeticTaskPage'
import App from '../App'
import LogicTaskPage from '../pages/LogicTaskPage'

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
            path: 'arithmetic/',
            element: <ArithmeticTaskPage />,
          },
          {
            path: 'logic/',
            element: <LogicTaskPage />,
          },
        ],
      },
    ],
  },
] 