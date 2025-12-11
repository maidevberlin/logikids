// External imports
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import * as Sentry from '@sentry/react'

// Internal imports
import './i18n.ts'
import './index.css'
import { router } from './routes'
import { ErrorBoundary, LoadingState } from '@/app/common'

// Initialize Sentry error tracking
const sentryDsn = import.meta.env.VITE_SENTRY_DSN
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    sendDefaultPii: true,
    environment: import.meta.env.MODE,
  })
}

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Failed to find the root element. The app cannot be initialized.')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Suspense fallback={<LoadingState />}>
        <RouterProvider router={router} />
      </Suspense>
    </ErrorBoundary>
  </React.StrictMode>
)
