import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { QRCodeSVG } from 'qrcode.react'
import { generateQRUrl } from './qrHelpers'
import { Button } from '@/app/common/ui/button'
import { Dialog, DialogContent } from '@/app/common/ui/dialog'
import { Eye } from 'lucide-react'

/**
 * Component for displaying QR code for device pairing
 * Shows QR code containing a URL that opens the app and logs in
 */
export function QRDisplay() {
  const { t } = useTranslation('profile')
  const [qrUrl, setQrUrl] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const openModal = async () => {
    setError(null)
    try {
      const url = await generateQRUrl()
      setQrUrl(url)
      setShowModal(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate QR code')
    }
  }

  const closeModal = (open: boolean) => {
    if (!open) {
      setShowModal(false)
      setQrUrl(null)
    }
  }

  return (
    <div className="space-y-4">
      {error && <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>}

      <Button onClick={openModal} variant="outline" className="w-full justify-start">
        <Eye className="w-4 h-4 mr-2" />
        {t('account.qrDisplay.showButton')}
      </Button>

      <Dialog open={showModal} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center space-y-4">
            {qrUrl && <QRCodeSVG value={qrUrl} size={280} level="H" includeMargin={true} />}
            <p className="text-xs text-muted-foreground text-center">
              {t('account.qrDisplay.scanInstruction')}
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 w-full">
              <p className="text-sm text-foreground">{t('account.qrDisplay.securityWarning')}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
