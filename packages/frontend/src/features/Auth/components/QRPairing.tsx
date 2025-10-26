import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { cryptoService } from '../services/crypto.service'
import { storageService } from '../services/storage.service'

/**
 * Component for displaying QR code for device pairing
 * Shows QR code containing userId + encryption key for scanning on new devices
 */
export function QRPairing() {
  const [qrData, setQrData] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showQR, setShowQR] = useState(false)

  /**
   * Generate QR code data
   */
  const generateQR = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const userId = await storageService.getUserId()
      const key = await storageService.getKey()

      if (!userId || !key) {
        throw new Error('Not authenticated')
      }

      // Generate QR data
      const qrString = await cryptoService.generateQRString(key, userId)
      setQrData(qrString)
      setShowQR(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate QR code')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Hide QR code (security: don't leave it visible)
   */
  const hideQR = () => {
    setShowQR(false)
    setQrData(null)
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Pair New Device</h3>
        <p className="text-sm text-gray-600 mb-4">
          Scan this QR code on your other device to sync your account.
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {!showQR ? (
        <div className="text-center">
          <button
            onClick={generateQR}
            disabled={isLoading}
            className="bg-blue-500 text-white rounded px-6 py-3 hover:bg-blue-600 transition disabled:bg-gray-400"
          >
            {isLoading ? 'Generating...' : '📱 Show QR Code to Pair Device'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* QR Code Display */}
          <div className="bg-white border-4 border-gray-200 rounded-lg p-8 flex justify-center">
            {qrData && (
              <QRCodeSVG
                value={qrData}
                size={256}
                level="H"
                includeMargin={true}
              />
            )}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2">📸 How to Pair:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
              <li>Open Logikids on your other device</li>
              <li>Go to "Restore from QR Code"</li>
              <li>Scan this QR code with your camera</li>
              <li>Your data will sync automatically!</li>
            </ol>
          </div>

          {/* Security Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2">🔒 Security Note:</h4>
            <p className="text-sm text-gray-700">
              This QR code contains your account credentials. Only scan it on devices you trust.
              Anyone who scans this code can access your account.
            </p>
          </div>

          {/* Hide Button */}
          <button
            onClick={hideQR}
            className="w-full bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-600 transition"
          >
            Hide QR Code
          </button>
        </div>
      )}

      {/* Additional Info */}
      <div className="text-xs text-gray-500 space-y-1">
        <p><strong>Privacy:</strong> QR code never sent to server</p>
        <p><strong>Works offline:</strong> No internet needed to scan</p>
        <p><strong>Instant sync:</strong> Data syncs immediately after pairing</p>
      </div>
    </div>
  )
}
