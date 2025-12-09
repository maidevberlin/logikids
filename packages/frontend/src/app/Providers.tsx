import { ReactNode, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { trpc, trpcClient } from '../api/trpc'
import { ErrorBoundary } from '@/app/common'
import { AuthProvider } from './account/AuthContext'
import { DataSyncProvider } from './account/DataSyncContext'
import { UserDataProvider } from './account/UserDataContext'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Cache data for 1 hour - subjects/concepts rarely change
            staleTime: 60 * 60 * 1000,
            // Keep unused data in cache for 2 hours
            gcTime: 2 * 60 * 60 * 1000,
            // Don't refetch on window focus for better UX
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <ErrorBoundary>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <DataSyncProvider>
              <UserDataProvider>{children}</UserDataProvider>
            </DataSyncProvider>
          </AuthProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </ErrorBoundary>
  )
}
