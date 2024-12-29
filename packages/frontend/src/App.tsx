import { Outlet } from 'react-router-dom'
import { Providers } from './components/Providers'

export default function App() {
  return (
    <Providers>
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-blue-600"
      >
        Skip to main content
      </a>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
        <main id="main-content" aria-label="Main content">
          <Outlet />
        </main>
      </div>
    </Providers>
  )
} 