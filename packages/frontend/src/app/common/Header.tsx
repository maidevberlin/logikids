import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Home, User, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  /** Show back button on the left */
  showBack?: boolean
  /** Show home button on the left */
  showHome?: boolean
  /** Custom content to display in the center of the header */
  centerContent?: ReactNode
  /** Show stats icon on the right */
  showStats?: boolean
  /** Show account icon on the right */
  showAccount?: boolean
  /** Additional custom actions on the right */
  rightContent?: ReactNode
}

export function Header({
  showBack = false,
  showHome = false,
  centerContent,
  showStats = false,
  showAccount = false,
  rightContent,
}: HeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm w-full relative z-10">
      <div className="px-6 py-4 w-full">
        <div className="flex items-center justify-between w-full">
          {/* Left: Navigation */}
          <div className="flex items-center min-w-[100px]">
            {showBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="rounded-xl hover:bg-gray-100"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back
              </Button>
            )}
            {showHome && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="rounded-xl hover:bg-gray-100"
              >
                <Home className="w-5 h-5 mr-1" />
                Home
              </Button>
            )}
          </div>

          {/* Center: Custom content or empty */}
          <div className="flex-1 flex items-center justify-center px-4">
            {centerContent}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 min-w-[100px] justify-end">
            {rightContent}
            {showStats && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/stats')}
                className="rounded-full w-10 h-10 p-0 hover:bg-gray-100"
              >
                <BarChart3 className="w-5 h-5" />
              </Button>
            )}
            {showAccount && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/account')}
                className="rounded-full w-10 h-10 p-0 hover:bg-gray-100"
              >
                <User className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
