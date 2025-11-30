import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Home, User } from 'lucide-react'
import { Button } from '@/app/common/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/app/common/ui/tooltip'
import { HeaderGameStats } from './HeaderGameStats'

interface HeaderProps {
  /** Show back button on the left */
  showBack?: boolean
  /** Show home button on the left */
  showHome?: boolean
  /** Custom content to display in the center of the header */
  centerContent?: ReactNode
  /** Show game stats (level + achievements) on the right */
  showGameStats?: boolean
  /** Show account icon on the right */
  showAccount?: boolean
  /** Additional custom actions on the right */
  rightContent?: ReactNode
}

export function Header({
  showBack = false,
  showHome = false,
  centerContent,
  showGameStats = false,
  showAccount = false,
  rightContent,
}: HeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="bg-card border-b border-border shadow-sm w-full relative z-10">
      <div className="px-3 sm:px-6 py-2 w-full">
        <div className="flex items-center justify-between w-full gap-2">
          {/* Left: Navigation */}
          <div className="flex items-center shrink-0">
            <TooltipProvider>
              {showBack && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(-1)}
                      className="rounded-xl hover:bg-muted"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Back</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {showHome && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/')}
                      className="rounded-xl hover:bg-muted"
                    >
                      <Home className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Home</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </TooltipProvider>
          </div>

          {/* Center: Custom content or empty */}
          <div className="flex-1 flex items-center justify-center px-2 min-w-0">
            {centerContent}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0 justify-end">
            {rightContent}
            {showGameStats && <HeaderGameStats />}
            {showAccount && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/account')}
                className="rounded-full w-10 h-10 p-0 hover:bg-muted"
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
