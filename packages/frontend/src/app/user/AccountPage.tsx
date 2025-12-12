import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { PageLayout } from '@/app/common/PageLayout'
import { useUserData } from '@/app/user'
import { ProfileSettings } from './ProfileSettings'
import { DataManagement } from './DataManagement'
import { Card } from '@/app/common/ui/card'
import { ChartBar, ChevronRight } from 'lucide-react'
import { createLogger } from '@/app/common/logger'

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
    <PageLayout showBack showHome showGameStats showAccount>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {t('account.title', { defaultValue: 'My Account' })}
          </h1>
          <p className="text-muted-foreground">
            {t('account.subtitle', { defaultValue: 'Manage your profile and preferences' })}
          </p>
        </div>

        <ProfileSettings settings={data.settings} onUpdate={updateSettings} />

        <DataManagement
          syncEnabled={data.settings.syncEnabled || false}
          lastSyncTimestamp={data.lastSyncTimestamp}
          onSyncToggle={handleSyncToggle}
        />

        {/* Parent Zone */}
        <Card className="p-8 bg-white shadow-md rounded-2xl">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-primary/10 p-3 rounded-full">
              <ChartBar className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              {t('account.parentZone', { defaultValue: 'Parent Zone' })}
            </h2>
          </div>

          <Link
            to="/parent-stats"
            className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/50 transition-colors"
          >
            <div>
              <div className="font-semibold text-foreground">
                {t('account.usageStats', { defaultValue: 'Usage Statistics' })}
              </div>
              <p className="text-sm text-muted-foreground">
                {t('account.usageStatsDescription', {
                  defaultValue: 'View AI usage and cost tracking',
                })}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </Link>
        </Card>
      </div>
    </PageLayout>
  )
}
