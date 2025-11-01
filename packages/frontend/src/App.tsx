import { Outlet } from 'react-router-dom'
import { Providers } from './app/Providers.tsx'

export default function App() {
  return (
    <Providers>
        <Outlet />
    </Providers>
  )
} 