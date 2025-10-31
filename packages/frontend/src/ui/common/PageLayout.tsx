import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb'
import { cn } from '@/lib/utils'

export interface PageLayoutProps {
  children: ReactNode
  breadcrumb?: BreadcrumbItem[]
  showBack?: boolean
  showHomeButton?: boolean
  className?: string
}

export function PageLayout({
  children,
  breadcrumb,
  showBack = false,
  showHomeButton = false,
  className
}: PageLayoutProps) {
  const navigate = useNavigate()

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className={cn('max-w-6xl mx-auto', className)}>
        {/* Kid-friendly big home button */}
        {showHomeButton && (
          <div className="mb-8 flex justify-center">
            <Button
              onClick={() => navigate('/')}
              size="lg"
              className="h-16 px-8 text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-2xl"
            >
              <Home className="w-6 h-6 mr-2" />
              Home
            </Button>
          </div>
        )}

        {/* Traditional breadcrumbs and back button for non-kid pages */}
        {(breadcrumb || showBack) && !showHomeButton && (
          <div className="mb-8">
            {showBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="mb-2 rounded-xl"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            )}
            {breadcrumb && <Breadcrumb items={breadcrumb} />}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
