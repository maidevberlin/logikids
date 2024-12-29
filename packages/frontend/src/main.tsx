import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import './i18n/config'
import './index.css'
import { router } from './routes'
import { LoadingState } from './components/base/LoadingState'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Failed to find the root element. The app cannot be initialized.')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Suspense fallback={<LoadingState />}>
      <RouterProvider router={router} />
    </Suspense>
  </React.StrictMode>
) 