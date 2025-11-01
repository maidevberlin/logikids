import { ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '../api/queryClient.ts'
import { ErrorBoundary } from '../ui/common/ErrorBoundary'
import { UserDataProvider } from './account/UserDataContext'

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