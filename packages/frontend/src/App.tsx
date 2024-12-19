import { Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SettingsButton } from './components/Settings/SettingsButton'
import { SettingsModal } from './components/Settings/SettingsModal'
import { useSettings } from './hooks/useSettings'
import { useState } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

export default function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const { settings, updateAge, updateName } = useSettings()

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
        <SettingsButton onClick={() => setIsSettingsOpen(true)} />
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          age={settings.age}
          name={settings.name}
          onAgeChange={updateAge}
          onNameChange={updateName}
        />
        <main>
          <Outlet />
        </main>
      </div>
    </QueryClientProvider>
  )
} 