import { Outlet } from 'react-router-dom'
import { Providers } from './components/Providers'

export default function App() {
  return (
    <Providers>
        <Outlet />
    </Providers>
  )
} 