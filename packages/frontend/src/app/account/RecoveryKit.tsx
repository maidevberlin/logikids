import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { jsPDF } from 'jspdf'
import { generateQRData } from '@/data/plugins/qr'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

/**
 * Component for generating and downloading recovery kit PDF
 * Recovery kit contains QR code and backup code for account recovery
 */
export function RecoveryKit() {
  const { t } = useTranslation('profile')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Convert QR data to base64 image for PDF
   */
  const generateQRImage = (qrData: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Create temporary canvas for QR code
      const canvas = document.createElement('canvas')
      const size = 256
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        reject(new Error('Cannot create canvas context'))
        return
      }

      // Use qrcode library to draw QR on canvas
      import('qrcode').then(QRCode => {
        QRCode.toCanvas(canvas, qrData, {
          width: size,
          margin: 2,
          errorCorrectionLevel: 'H',
        }, (error) => {
          if (error) {
            reject(error)
          } else {
            resolve(canvas.toDataURL('image/png'))
          }
        })
      }).catch(reject)
    })
  }

  /**
   * Format userId and key as backup code
   * Format: XXXX-XXXX-XXXX-XXXX-...
   */
  const formatBackupCode = (userId: string, keyJson: string): string => {
    const combined = `${userId}:${keyJson}`
    const base64 = btoa(combined)

    // Split into groups of 4 characters
    const groups = []
    for (let i = 0; i < base64.length; i += 4) {
      groups.push(base64.substring(i, i + 4))
    }

    return groups.join('-')
  }

  /**
   * Generate and download recovery kit PDF
   */
  const handleGenerateKit = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      // Get credentials from current data
      const qrPayload = await generateQRData()
      const qrDataString = JSON.stringify(qrPayload)
      const qrImage = await generateQRImage(qrDataString)

      // Generate backup code
      const backupCode = formatBackupCode(qrPayload.userId, qrPayload.key)

      // Create PDF
      const pdf = new jsPDF()
      const pageWidth = pdf.internal.pageSize.getWidth()

      // === HEADER ===
      pdf.setFillColor(59, 130, 246) // Blue-500
      pdf.rect(0, 0, pageWidth, 35, 'F')

      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(22)
      pdf.setFont('helvetica', 'bold')
      pdf.text(t('account.recoveryKit.pdf.title'), pageWidth / 2, 15, { align: 'center' })

      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'normal')
      pdf.text(t('account.recoveryKit.pdf.subtitle'), pageWidth / 2, 25, { align: 'center' })

      // === QR CODE SECTION ===
      pdf.setTextColor(0, 0, 0)
      const qrBoxY = 45
      const qrBoxHeight = 80

      // QR Box background
      pdf.setFillColor(248, 250, 252) // Gray-50
      pdf.setDrawColor(226, 232, 240) // Gray-200
      pdf.roundedRect(15, qrBoxY, pageWidth - 30, qrBoxHeight, 3, 3, 'FD')

      // QR Code
      const qrSize = 60
      const qrX = (pageWidth - qrSize) / 2
      pdf.addImage(qrImage, 'PNG', qrX, qrBoxY + 5, qrSize, qrSize)

      // QR Label
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      pdf.text(t('account.recoveryKit.pdf.qrLabel'), pageWidth / 2, qrBoxY + qrSize + 12, { align: 'center' })

      // === BACKUP CODE SECTION ===
      let y = qrBoxY + qrBoxHeight + 15

      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.text(t('account.recoveryKit.pdf.backupCodeTitle'), 20, y)

      y += 8

      // Backup code text - format nicely in rows
      pdf.setFontSize(8)
      pdf.setFont('courier', 'normal')

      // Split code into chunks of 48 chars for readability
      const chunkSize = 48
      const codeChunks = []
      for (let i = 0; i < backupCode.length; i += chunkSize) {
        codeChunks.push(backupCode.substring(i, i + chunkSize))
      }

      // Calculate box height based on number of lines
      const lineHeight = 4.5
      const codeBoxHeight = (codeChunks.length * lineHeight) + 12

      // Backup code box with clear boundary
      pdf.setFillColor(255, 255, 255)
      pdf.setDrawColor(59, 130, 246) // Blue-500
      pdf.setLineWidth(0.5)
      pdf.roundedRect(15, y, pageWidth - 30, codeBoxHeight, 3, 3, 'FD')

      pdf.setTextColor(0, 0, 0)
      let codeY = y + 8
      for (const chunk of codeChunks) {
        pdf.text(chunk, pageWidth / 2, codeY, { align: 'center' })
        codeY += lineHeight
      }

      // User ID
      y += codeBoxHeight + 10
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(100, 116, 139) // Gray-500
      pdf.text(`${t('account.recoveryKit.pdf.userIdLabel')} ${qrPayload.userId}`, 20, y)

      // === INSTRUCTIONS SECTION ===
      y += 15
      pdf.setTextColor(0, 0, 0)
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'bold')
      pdf.text(t('account.recoveryKit.pdf.instructionsTitle'), 20, y)

      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      y += 7
      const instructions = [
        t('account.recoveryKit.pdf.instruction1'),
        t('account.recoveryKit.pdf.instruction2'),
        t('account.recoveryKit.pdf.instruction3'),
        t('account.recoveryKit.pdf.instruction4'),
      ]
      for (const instruction of instructions) {
        pdf.text(`• ${instruction}`, 25, y)
        y += 6
      }

      // === SECURITY WARNING ===
      y += 8
      pdf.setFillColor(254, 242, 242) // Red-50
      pdf.setDrawColor(254, 202, 202) // Red-200
      pdf.roundedRect(15, y - 5, pageWidth - 30, 20, 3, 3, 'FD')

      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(220, 38, 38) // Red-600
      pdf.text(t('account.recoveryKit.pdf.securityWarningTitle'), 20, y)

      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'normal')
      y += 5
      pdf.text(t('account.recoveryKit.pdf.securityWarning1'), 20, y)
      y += 4
      pdf.text(t('account.recoveryKit.pdf.securityWarning2'), 20, y)

      // === FOOTER ===
      pdf.setFontSize(8)
      pdf.setTextColor(156, 163, 175) // Gray-400
      pdf.text(t('account.recoveryKit.pdf.footer'), pageWidth / 2, 280, { align: 'center' })
      pdf.text(new Date().toLocaleString(), pageWidth / 2, 285, { align: 'center' })

      // Download PDF
      pdf.save(`logikids-recovery-kit-${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate recovery kit')
      console.error('Recovery kit generation failed:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}

      <Button
        onClick={handleGenerateKit}
        variant="outline"
        className="w-full justify-start"
        disabled={isGenerating}
      >
        <Download className="w-4 h-4 mr-2" />
        {isGenerating ? t('account.recoveryKit.generating') : t('account.recoveryKit.downloadButton')}
      </Button>

      <div className="text-xs text-muted-foreground space-y-1">
        <p>{t('account.recoveryKit.whatsIncluded')}</p>
        <p>{t('account.recoveryKit.securityNote')}</p>
      </div>
    </div>
  )
}
