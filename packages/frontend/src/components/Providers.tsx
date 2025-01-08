import { ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '../api/queryClient'
import { ErrorBoundary } from './base/Error/ErrorBoundary'
import { SettingsProvider } from './Account/Settings/SettingsProvider'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
} 