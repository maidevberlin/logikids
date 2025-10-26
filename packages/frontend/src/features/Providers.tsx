import { ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '../api/queryClient'
import { ErrorBoundary } from './base/Error/ErrorBoundary'
import { UserDataProvider } from './UserData'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <UserDataProvider>
          {children}
        </UserDataProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
} 