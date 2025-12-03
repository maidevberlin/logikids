import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Html5Qrcode } from 'html5-qrcode'
import { prepareImportData, QRPayload } from '@/data/plugins/qr'
import { useAuth } from '@/app/account'
import { useSync } from '@/app/account/useSync'
import { Button } from '@/app/common/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/common/ui/dialog'
import { Camera, X } from 'lucide-react'

interface QRScannerProps {
  onClose: () => void
  onSuccess: () => void
}

export function QRScanner({ onClose, onSuccess }: QRScannerProps) {
  const { t } = useTranslation('common')
  const { login } = useAuth()
  const { sync } = useSync()
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const startScanner = async () => {
    try {
      setError(null)
      setIsScanning(true)

      const scanner = new Html5Qrcode('qr-reader')
      scannerRef.current = scanner

      await scanner.start(
        { facingMode: 'environment' }, // Use back camera
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          // QR code scanned successfully
          try {
            const payload: QRPayload = JSON.parse(decodedText)

            // Prepare storage (store key + userId)
            await prepareImportData(payload)

            // Login with backend to get JWT tokens
            await login(payload.userId)

            // Sync data from server
            try {
              await sync()
            } catch (error) {
              console.error('Sync after import failed', error)
            }

            // Trigger data refresh event
            window.dispatchEvent(new Event('data-changed'))

            await stopScanner()
            onSuccess()
          } catch (err) {
            setError(t('welcomeChoice.import.invalidQR', { defaultValue: 'Invalid QR code' }))
          }
        },
        (_errorMessage) => {
          // Scanning error (ignore - just means no QR found yet)
        }
      )
    } catch (err) {
      setError(t('welcomeChoice.import.cameraError', { defaultValue: 'Cannot access camera' }))
      setIsScanning(false)
    }
  }

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop()
        scannerRef.current.clear()
      } catch (err) {
        // Ignore errors when stopping
      }
      scannerRef.current = null
    }
    setIsScanning(false)
  }

  useEffect(() => {
    void startScanner()

    return () => {
      void stopScanner()
    }
  }, [])

  const handleClose = async () => {
    await stopScanner()
    onClose()
  }

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            {t('welcomeChoice.import.scanQR', { defaultValue: 'Scan QR Code' })}
          </DialogTitle>
          <DialogDescription>
            {t('welcomeChoice.import.scanQRDescription', {
              defaultValue: 'Point your camera at the QR code from your recovery kit',
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>}

          {/* QR Scanner Container */}
          <div
            className="relative bg-black rounded-lg overflow-hidden"
            style={{ aspectRatio: '1' }}
          >
            <div id="qr-reader" ref={containerRef} className="w-full" />
            {!isScanning && !error && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-center">
                  <Camera className="w-12 h-12 mx-auto mb-2" />
                  <p>
                    {t('welcomeChoice.import.initializingCamera', {
                      defaultValue: 'Initializing camera...',
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>

          <Button variant="outline" onClick={handleClose} className="w-full">
            <X className="w-4 h-4 mr-2" />
            {t('welcomeChoice.import.cancel', { defaultValue: 'Cancel' })}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
