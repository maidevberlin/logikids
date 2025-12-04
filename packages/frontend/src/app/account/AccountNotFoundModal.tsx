import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/common/ui/dialog'
import { Button } from '@/app/common/ui/button'
import { AlertCircle } from 'lucide-react'
import { createLogger } from '@/lib/logger'

const logger = createLogger('AccountNotFoundModal')

/**
 * Modal shown when the user's account is not found in the backend database.
 * This happens when the database is reset but the user still has old credentials stored locally.
 * The only option is to delete all local data and start fresh.
 *
 * Rendered conditionally by AuthContext when account is not found.
 */
export function AccountNotFoundModal() {
  const { t } = useTranslation('profile')

  const handleDeleteData = async () => {
    try {
      logger.info('User confirmed data deletion due to account not found')

      // Clear all storage
      localStorage.clear()

      // Clear IndexedDB by deleting the database
      const DB_NAME = 'logikids_secure_storage'
      await new Promise<void>((resolve, reject) => {
        const request = indexedDB.deleteDatabase(DB_NAME)
        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve()
        request.onblocked = () => resolve() // Resolve anyway if blocked
      })

      // Reload to reset everything
      window.location.href = '/#/welcome-choice'
    } catch (error) {
      logger.error('Failed to delete data', error as Error)
      // Still reload even if deletion fails
      window.location.href = '/#/welcome-choice'
    }
  }

  return (
    <Dialog open onOpenChange={() => {}} modal>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="bg-yellow-100 p-3 rounded-full">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl">
            {t('account.accountNotFound.title', {
              defaultValue: 'Time for a Fresh Start!',
            })}
          </DialogTitle>
          <DialogDescription className="text-center space-y-3 pt-4">
            <p>
              {t('account.accountNotFound.message1', {
                defaultValue:
                  'Your previous account needs to be reset due to recent updates during our beta phase.',
              })}
            </p>
            <p className="font-semibold">
              {t('account.accountNotFound.message2', {
                defaultValue:
                  "Ready to start fresh? You'll need a new invite code to continue your learning journey!",
              })}
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-col gap-2">
          <Button onClick={handleDeleteData} variant="default" className="w-full" size="lg">
            {t('account.accountNotFound.startButton', {
              defaultValue: 'Start Fresh',
            })}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            {t('account.accountNotFound.note', {
              defaultValue: 'This will clear your local data',
            })}
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
