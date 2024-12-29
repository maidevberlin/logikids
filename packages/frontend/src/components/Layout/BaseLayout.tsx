import { ReactNode } from 'react'
import { Page } from '../base/layout'
import { SettingsProvider } from '../Settings/SettingsProvider'

interface BaseLayoutProps {
  children: ReactNode
}

export function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <SettingsProvider>
      <Page>
        {children}
      </Page>
    </SettingsProvider>
  )
} 