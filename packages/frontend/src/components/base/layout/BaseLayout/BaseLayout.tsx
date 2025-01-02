import { SettingsProvider } from '../../../Settings/SettingsProvider'
import { Page } from '../Page/Page'
import { cn } from '../../../../utils/cn'
import { BaseLayoutProps } from './types'
import { styles } from './styles'

export function BaseLayout({ children, className }: BaseLayoutProps) {
  return (
    <SettingsProvider>
      <div className={cn(styles.base, className)}>
        <Page>
          {children}
        </Page>
      </div>
    </SettingsProvider>
  )
} 