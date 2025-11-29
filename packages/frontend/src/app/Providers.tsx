import { ReactNode, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { trpc, trpcClient } from '../api/trpc'
import { ErrorBoundary } from '../ui/common/ErrorBoundary'
import { AuthProvider } from './account/AuthContext'
import { DataSyncProvider } from './account/DataSyncContext'
import { UserDataProvider } from './account/UserDataContext'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <ErrorBoundary>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <DataSyncProvider>
              <UserDataProvider>
                {children}
              </UserDataProvider>
            </DataSyncProvider>
          </AuthProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </ErrorBoundary>
  )
} 