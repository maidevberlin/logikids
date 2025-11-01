import { ReactNode } from 'react'
import { Header } from './Header'
import { cn } from '@/lib/utils'

export interface PageLayoutProps {
  children: ReactNode
  /** Show the header (default: true) */
  showHeader?: boolean
  /** Show back button in header */
  showBack?: boolean
  /** Show home button in header */
  showHome?: boolean
  /** Show account icon in header */
  showAccount?: boolean
  /** Custom content to display in the center of the header */
  headerCenter?: ReactNode
  /** Additional custom actions on the right of the header */
  headerRight?: ReactNode
  /** Custom className for the content container */
  className?: string
}

export function PageLayout({
  children,
  showHeader = true,
  showBack = false,
  showHome = false,
  showAccount = false,
  headerCenter,
  headerRight,
  className
}: PageLayoutProps) {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Unified Header */}
      {showHeader && (
        <Header
          showBack={showBack}
          showHome={showHome}
          showAccount={showAccount}
          centerContent={headerCenter}
          rightContent={headerRight}
        />
      )}

      {/* Page Content */}
      <div className="p-8">
        <div className={cn('max-w-6xl mx-auto', className)}>
          {children}
        </div>
      </div>
    </div>
  )
}
