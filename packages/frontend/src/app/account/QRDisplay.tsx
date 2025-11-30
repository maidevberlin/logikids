import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { QRCodeSVG } from 'qrcode.react'
import { generateQRData } from '@/data/plugins/qr'
import { Button } from '@/app/common/ui/button'
import { Eye, EyeOff } from 'lucide-react'

/**
 * Component for displaying QR code for device pairing
 * Shows QR code containing userId + encryption key for scanning on other devices
 */
export function QRDisplay() {
  const { t } = useTranslation('profile')
  const [qrData, setQrData] = useState<string | null>(null)
  const [showQR, setShowQR] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Generate QR code data when component mounts or when shown
   */
  useEffect(() => {
    if (showQR && !qrData) {
      void generateQR()
    }
  }, [showQR])

  /**
   * Generate QR code data
   */
  const generateQR = async () => {
    setError(null)

    try {
      const payload = await generateQRData()
      const qrString = JSON.stringify(payload)
      setQrData(qrString)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate QR code')
      setShowQR(false)
    }
  }

  /**
   * Toggle QR code visibility
   */
  const toggleQR = () => {
    if (!showQR) {
      setShowQR(true)
    } else {
      setShowQR(false)
      setQrData(null)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}

      {!showQR ? (
        <Button
          onClick={toggleQR}
          variant="outline"
          className="w-full justify-start"
        >
          <Eye className="w-4 h-4 mr-2" />
          {t('account.qrDisplay.showButton')}
        </Button>
      ) : (
        <div className="space-y-4">
          {/* QR Code Display */}
          <div className="bg-card border-2 rounded-xl p-6 flex flex-col items-center">
            {qrData && (
              <>
                <QRCodeSVG
                  value={qrData}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  {t('account.qrDisplay.scanInstruction')}
                </p>
              </>
            )}
          </div>

          {/* Security Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-foreground">
              {t('account.qrDisplay.securityWarning')}
            </p>
          </div>

          {/* Hide Button */}
          <Button
            onClick={toggleQR}
            variant="outline"
            className="w-full justify-start"
          >
            <EyeOff className="w-4 h-4 mr-2" />
            {t('account.qrDisplay.hideButton')}
          </Button>
        </div>
      )}
    </div>
  )
}
