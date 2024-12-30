import { ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '../services/queryClient'
import { NavigationProvider } from './Navigation'
import { ErrorBoundary } from './base/ErrorBoundary'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <NavigationProvider>
          {children}
        </NavigationProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
} 