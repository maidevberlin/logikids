import { Outlet } from 'react-router-dom'
import { Providers } from './features/Providers'

export default function App() {
  return (
    <Providers>
        <Outlet />
    </Providers>
  )
} 