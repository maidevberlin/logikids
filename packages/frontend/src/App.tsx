import { Outlet } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './services/queryClient'
import { SettingsProvider } from './components/Settings/SettingsProvider'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
          <main>
            <Outlet />
          </main>
        </div>
      </SettingsProvider>
    </QueryClientProvider>
  )
} 