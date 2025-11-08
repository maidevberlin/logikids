import { Outlet } from 'react-router-dom'
import { Providers } from './app/Providers.tsx'
import { useTimeOfDay } from './hooks/useTimeOfDay'

export default function App() {
  useTimeOfDay(); // Applies time-based class to body

  return (
    <Providers>
        <Outlet />
    </Providers>
  )
} 