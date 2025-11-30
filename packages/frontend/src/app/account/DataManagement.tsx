import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/app/common/ui/card'
import { Label } from '@/app/common/ui/label'
import { Button } from '@/app/common/ui/button'
import { Switch } from '@/app/common/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/common/ui/dialog'
import { Database, LogOut, Trash2 } from 'lucide-react'
import { useAuth } from './AuthContext'
import { RecoveryKit } from './RecoveryKit'
import { QRDisplay } from './QRDisplay'
import { ExportData } from './ExportData'
import { ImportData } from './ImportData'
import { createLogger } from '@/lib/logger'

const logger = createLogger('DataManagement')

interface DataManagementProps {
  syncEnabled: boolean
  lastSyncTimestamp?: number
  onSyncToggle: (enabled: boolean) => Promise<void>
}

export function DataManagement({
  syncEnabled,
  lastSyncTimestamp,
  onSyncToggle,
}: DataManagementProps) {
  const { t } = useTranslation('profile')
  const { logout } = useAuth()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [localSyncEnabled, setLocalSyncEnabled] = useState(syncEnabled)

  // Format last sync timestaamp
  const formatLastSync = (timestamp?: number) => {
    if (!timestamp) {
      return t('account.neverSynced', { defaultValue: 'Never' })
    }

    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) {
      return t('account.justNow', { defaultValue: 'Just now' })
    } else if (minutes < 60) {
      return t('account.minutesAgo', { defaultValue: '{{count}} minutes ago', count: minutes })
    } else if (hours < 24) {
      return t('account.hoursAgo', { defaultValue: '{{count}} hours ago', count: hours })
    } else if (days < 7) {
      return t('account.daysAgo', { defaultValue: '{{count}} days ago', count: days })
    } else {
      return new Date(timestamp).toLocaleDateString()
    }
  }

  const handleSyncToggle = async (checked: boolean) => {
    setLocalSyncEnabled(checked)
    try {
      await onSyncToggle(checked)
    } catch (error) {
      logger.error('Failed to update sync setting', error as Error)
      // Revert on error
      setLocalSyncEnabled(!checked)
    }
  }

  const handleLogout = async () => {
    try {
      // Use AuthContext logout which handles all cleanup
      await logout()

      // Close dialog and reload to go back to welcome screen
      setShowLogoutDialog(false)
      window.location.reload()
    } catch (error) {
      logger.error('Failed to logout', error as Error)
      // Still proceed with reload even if logout fails
      window.location.reload()
    }
  }

  const handleDelete = () => {
    if (
      window.confirm(
        t('account.deleteConfirm', {
          defaultValue: 'Are you sure you want to delete all your data? This cannot be undone.',
        })
      )
    ) {
      localStorage.clear()
      window.location.reload()
    }
  }

  return (
    <>
      <Card className="p-8 bg-white shadow-md rounded-2xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-primary/10 p-3 rounded-full">
            <Database className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            {t('account.dataManagement', { defaultValue: 'Data Management' })}
          </h2>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            {t('account.dataInfo', {
              defaultValue:
                'Your data is stored securely on your device. You can export or delete it at any time.',
            })}
          </p>

          {/* Export Data - Always available */}
          <ExportData />

          {/* Import Data - Restore from backup */}
          <ImportData />

          <div className="border-t pt-4" />

          {/* Cloud Backup Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-xl">
            <div className="flex-1">
              <Label
                htmlFor="sync-enabled"
                className="text-base font-semibold text-foreground cursor-pointer block"
              >
                {t('settings.syncLabel', { defaultValue: 'Cloud Backup' })}
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                {t('settings.syncDescription', {
                  defaultValue: 'Automatically backup your data to the cloud',
                })}
              </p>
              {lastSyncTimestamp && (
                <p className="text-xs text-muted-foreground mt-1">
                  {t('account.lastSynced', {
                    defaultValue: 'Last synced: {{time}}',
                    time: formatLastSync(lastSyncTimestamp),
                  })}
                </p>
              )}
            </div>
            <Switch
              id="sync-enabled"
              checked={localSyncEnabled}
              onCheckedChange={handleSyncToggle}
            />
          </div>

          {/* Recovery Kit & QR Code - Only show when cloud backup is enabled */}
          {localSyncEnabled && (
            <>
              <RecoveryKit />

              <div className="border-t pt-4">
                <QRDisplay />
              </div>
            </>
          )}

          <div className="border-t pt-4" />

          <Button
            onClick={() => setShowLogoutDialog(true)}
            variant="outline"
            className="w-full justify-start"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {t('account.logout', { defaultValue: 'Logout' })}
          </Button>

          <Button
            onClick={handleDelete}
            variant="outline"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {t('account.deleteData', { defaultValue: 'Delete All Data' })}
          </Button>
        </div>
      </Card>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('account.logoutTitle', { defaultValue: 'Logout' })}</DialogTitle>
            <DialogDescription>
              {t('account.logoutDescription', {
                defaultValue:
                  'Are you sure you want to logout? This will clear all your data from this device. If you have cloud backup enabled, your data will be preserved and you can sign in again to restore it.',
              })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogoutDialog(false)}>
              {t('account.cancel', { defaultValue: 'Cancel' })}
            </Button>
            <Button variant="default" onClick={handleLogout}>
              {t('account.confirmLogout', { defaultValue: 'Logout' })}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
