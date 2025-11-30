import { useTranslation } from 'react-i18next'
import { PageLayout } from '@/app/common'
import { useUserData } from '@/app/account'
import { ProfileSettings } from './ProfileSettings'
import { DataManagement } from './DataManagement'
import { createLogger } from '@/lib/logger'

const logger = createLogger('AccountPage')

export function AccountPage() {
  const { t } = useTranslation('profile')
  const { data, updateSettings } = useUserData()

  const handleSyncToggle = async (enabled: boolean) => {
    try {
      await updateSettings({ syncEnabled: enabled })
    } catch (error) {
      logger.error('Failed to update sync setting', error as Error)
      throw error // Re-throw so DataManagement can handle revert
    }
  }

  if (!data) return null

  return (
    <PageLayout
      showBack
      showHome
      showGameStats
      showAccount
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {t('account.title', { defaultValue: 'My Account' })}
          </h1>
          <p className="text-muted-foreground">
            {t('account.subtitle', { defaultValue: 'Manage your profile and preferences' })}
          </p>
        </div>

        <ProfileSettings
          settings={data.settings}
          onUpdate={updateSettings}
        />

        <DataManagement
          syncEnabled={data.settings.syncEnabled || false}
          lastSyncTimestamp={data.lastSyncTimestamp}
          onSyncToggle={handleSyncToggle}
        />
      </div>
    </PageLayout>
  )
}
