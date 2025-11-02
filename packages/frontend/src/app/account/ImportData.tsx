import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { importQRData, QRPayload } from '@/data/plugins/qr'
import { getData } from '@/data/core/userData'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Upload, AlertTriangle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

/**
 * Component for importing account data from QR code or backup code
 * Handles conflict resolution when device already has data
 */
export function ImportData() {
  const { t } = useTranslation('profile')
  const [backupCode, setBackupCode] = useState('')
  const [isImporting, setIsImporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showConflictDialog, setShowConflictDialog] = useState(false)
  const [pendingImport, setPendingImport] = useState<QRPayload | null>(null)

  /**
   * Parse backup code to QRPayload
   * Format: XXXX-XXXX-XXXX-... (base64 encoded userId:keyJson)
   */
  const parseBackupCode = (code: string): QRPayload => {
    // Remove dashes and whitespace
    const base64 = code.replace(/[-\s]/g, '')

    // Decode base64
    const decoded = atob(base64)

    // Split userId and key
    const [userId, keyJson] = decoded.split(':', 2)

    if (!userId || !keyJson) {
      throw new Error('Invalid backup code format')
    }

    // Parse to ensure it's valid JSON
    JSON.parse(keyJson)

    return {
      userId,
      key: keyJson,
      timestamp: Date.now()
    }
  }

  /**
   * Check if device has existing data
   */
  const hasExistingData = async (): Promise<boolean> => {
    try {
      const data = await getData()
      // Check if there's meaningful progress data
      return Object.keys(data?.progress || {}).length > 0
    } catch {
      return false
    }
  }

  /**
   * Handle import with conflict check
   */
  const handleImport = async () => {
    setError(null)
    setSuccess(false)

    // Validate input
    if (!backupCode.trim()) {
      setError(t('account.import.enterCodeError'))
      return
    }

    try {
      // Parse backup code
      const payload = parseBackupCode(backupCode)

      // Check for existing data
      const hasData = await hasExistingData()
      if (hasData) {
        setPendingImport(payload)
        setShowConflictDialog(true)
        return
      }

      // No conflict, proceed with import
      await performImport(payload)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('account.import.invalidCodeError'))
    }
  }

  /**
   * Perform the actual import
   */
  const performImport = async (payload: QRPayload) => {
    setIsImporting(true)
    setError(null)

    try {
      await importQRData(payload)
      setSuccess(true)
      setBackupCode('')
      setShowConflictDialog(false)
      setPendingImport(null)

      // Reload page to reflect new data
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed')
    } finally {
      setIsImporting(false)
    }
  }

  /**
   * Handle confirmed override
   */
  const handleConfirmOverride = async () => {
    if (pendingImport) {
      await performImport(pendingImport)
    }
  }

  /**
   * Handle cancel override
   */
  const handleCancelOverride = () => {
    setShowConflictDialog(false)
    setPendingImport(null)
  }

  return (
    <>
      <div className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 rounded-lg bg-green-50 text-green-600 text-sm">
            ✅ {t('account.import.importSuccess')}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="backup-code" className="text-sm font-medium">
            {t('account.import.backupCodeLabel')}
          </Label>
          <textarea
            id="backup-code"
            value={backupCode}
            onChange={(e) => setBackupCode(e.target.value)}
            placeholder={t('account.import.backupCodePlaceholder')}
            className="w-full h-24 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono"
            disabled={isImporting}
          />
          <p className="text-xs text-gray-500">
            {t('account.import.backupCodeHint')}
          </p>
        </div>

        <Button
          onClick={handleImport}
          variant="outline"
          className="w-full justify-start"
          disabled={isImporting || !backupCode.trim()}
        >
          <Upload className="w-4 h-4 mr-2" />
          {isImporting ? t('account.import.importing') : t('account.import.importButton')}
        </Button>
      </div>

      {/* Conflict Resolution Dialog */}
      <Dialog open={showConflictDialog} onOpenChange={setShowConflictDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              {t('account.import.conflictTitle')}
            </DialogTitle>
            <DialogDescription className="space-y-2">
              <p>
                {t('account.import.conflictMessage')}
              </p>
              <p className="text-sm text-gray-600">
                {t('account.import.conflictWarning')}
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelOverride}
              disabled={isImporting}
            >
              {t('account.import.conflictCancel')}
            </Button>
            <Button
              variant="default"
              onClick={handleConfirmOverride}
              disabled={isImporting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isImporting ? t('account.import.importing') : t('account.import.conflictConfirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
