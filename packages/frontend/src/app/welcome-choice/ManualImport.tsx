import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { importQRData, parseBackupCode } from '@/data/plugins/qr'
import { Button } from '@/app/common/ui/button'
import { Label } from '@/app/common/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/app/common/ui/dialog'
import { createLogger } from '@/lib/logger'

const logger = createLogger('ManualImport')

interface ManualImportProps {
  onClose: () => void
  onSuccess: () => void
}

export function ManualImport({ onClose, onSuccess }: ManualImportProps) {
  const { t } = useTranslation('common')
  const [backupCode, setBackupCode] = useState('')
  const [isImporting, setIsImporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImport = async () => {
    if (!backupCode.trim()) {
      setError(t('welcomeChoice.import.enterCode', { defaultValue: 'Please enter a backup code' }))
      return
    }

    setIsImporting(true)
    setError(null)

    try {
      const payload = parseBackupCode(backupCode)
      await importQRData(payload)
      onSuccess()
    } catch (err) {
      logger.error('Manual import error', err as Error)
      setError(err instanceof Error ? err.message : t('welcomeChoice.import.importFailed', { defaultValue: 'Import failed' }))
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('welcomeChoice.import.manualCode', { defaultValue: 'Enter Backup Code' })}</DialogTitle>
          <DialogDescription>
            {t('welcomeChoice.import.manualCodeDescription', { defaultValue: 'Paste your backup code from the recovery kit' })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="backup-code">{t('welcomeChoice.import.backupCode', { defaultValue: 'Backup Code' })}</Label>
            <textarea
              id="backup-code"
              value={backupCode}
              onChange={(e) => setBackupCode(e.target.value)}
              placeholder="XXXX-XXXX-XXXX-XXXX..."
              className="w-full h-32 px-3 py-2 text-sm border border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono"
              disabled={isImporting}
              autoFocus
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1" disabled={isImporting}>
              {t('welcomeChoice.import.cancel', { defaultValue: 'Cancel' })}
            </Button>
            <Button onClick={handleImport} className="flex-1" disabled={isImporting || !backupCode.trim()}>
              {isImporting ? t('welcomeChoice.import.importing', { defaultValue: 'Importing...' }) : t('welcomeChoice.import.import', { defaultValue: 'Import' })}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
