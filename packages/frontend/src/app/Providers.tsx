import { ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '../api/queryClient.ts'
import { ErrorBoundary } from '../ui/common/ErrorBoundary'
import { AuthProvider } from './account/AuthContext'
import { DataSyncProvider } from './account/DataSyncContext'
import { UserDataProvider } from './account/UserDataContext'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <DataSyncProvider>
            <UserDataProvider>
              {children}
            </UserDataProvider>
          </DataSyncProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
} 