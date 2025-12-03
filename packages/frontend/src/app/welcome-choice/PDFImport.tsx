import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import * as pdfjsLib from 'pdfjs-dist'
import { prepareImportData, parseBackupCode } from '@/data/plugins/qr'
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
import { Upload, FileText } from 'lucide-react'
import { createLogger } from '@/lib/logger'

const logger = createLogger('PDFImport')

// Set worker path for PDF.js - use local bundled worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString()

interface PDFImportProps {
  onClose: () => void
  onSuccess: () => void
}

export function PDFImport({ onClose, onSuccess }: PDFImportProps) {
  const { t } = useTranslation('common')
  const { login } = useAuth()
  const { sync } = useSync()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  /**
   * Extract backup code from PDF text
   * Now simplified since PDF contains backup code as continuous string
   */
  const extractBackupCode = (text: string): string => {
    // Look for the backup code section - it's after "Backup-Code" or "Backup Code" text
    // and consists of base64 characters with dashes every 4 chars
    const backupCodeMarkers = ['Backup-Code', 'Backup Code', 'BackupCode', 'Backup-code']
    let startIndex = -1

    for (const marker of backupCodeMarkers) {
      startIndex = text.indexOf(marker)
      if (startIndex !== -1) {
        startIndex += marker.length
        break
      }
    }

    if (startIndex === -1) {
      throw new Error(
        t('welcomeChoice.import.noBackupCodeFound', {
          defaultValue: 'Could not find backup code in PDF. Please try manual entry instead.',
        })
      )
    }

    // Extract text after the marker
    const afterMarker = text.substring(startIndex)

    // Find the backup code - it's a continuous string of base64 chars with dashes
    // Pattern: XXXX-XXXX-XXXX-... (base64 with dashes every 4 chars)
    // Stop at "Benutzer" or "User" text
    const endMarkers = ['Benutzer', 'User', 'Anleitung', 'Instruction', 'Sicherheit', 'Security']
    let endIndex = afterMarker.length

    for (const marker of endMarkers) {
      const idx = afterMarker.indexOf(marker)
      if (idx !== -1 && idx < endIndex) {
        endIndex = idx
      }
    }

    const codeSection = afterMarker.substring(0, endIndex)

    // Remove all whitespace and newlines
    let backupCode = codeSection.replace(/\s+/g, '')

    // Remove dashes
    backupCode = backupCode.replace(/-/g, '')

    // Validate it's proper base64
    if (backupCode.length < 50) {
      throw new Error(
        t('welcomeChoice.import.noBackupCodeFound', {
          defaultValue: 'Could not find backup code in PDF. Please try manual entry instead.',
        })
      )
    }

    // Only keep valid base64 characters
    backupCode = backupCode.replace(/[^A-Za-z0-9+/=]/g, '')

    // Fix padding
    backupCode = backupCode.replace(/=+/g, '')
    const paddingNeeded = (4 - (backupCode.length % 4)) % 4
    backupCode += '='.repeat(paddingNeeded)

    // Test decode to validate
    try {
      atob(backupCode)
    } catch (e) {
      throw new Error(
        t('welcomeChoice.import.corruptedBackupCode', {
          defaultValue: 'Backup code appears to be corrupted or incomplete',
        })
      )
    }

    return backupCode
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.includes('pdf')) {
      setError(
        t('welcomeChoice.import.invalidFileType', { defaultValue: 'Please select a PDF file' })
      )
      return
    }

    setFileName(file.name)
    setIsProcessing(true)
    setError(null)

    try {
      // Read PDF file
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

      // Extract text from all pages
      let fullText = ''
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const pageText = textContent.items.map((item) => ('str' in item ? item.str : '')).join('\n')
        fullText += pageText + '\n'
      }

      // Extract backup code from text
      const backupCode = extractBackupCode(fullText)

      // Parse backup code
      const payload = parseBackupCode(backupCode)

      // Prepare storage (store key + userId)
      await prepareImportData(payload)

      // Login with backend to get JWT tokens
      await login(payload.userId)

      // Sync data from server
      try {
        await sync()
      } catch (error) {
        logger.error('Sync after import failed', error as Error)
      }

      // Trigger data refresh event
      window.dispatchEvent(new Event('data-changed'))

      onSuccess()
    } catch (err) {
      logger.error('PDF import error', err as Error)
      setError(
        err instanceof Error
          ? err.message
          : t('welcomeChoice.import.pdfParseError', { defaultValue: 'Failed to parse PDF file' })
      )
    } finally {
      setIsProcessing(false)
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            {t('welcomeChoice.import.uploadPDF', { defaultValue: 'Upload Recovery Kit PDF' })}
          </DialogTitle>
          <DialogDescription>
            {t('welcomeChoice.import.uploadPDFDescription', {
              defaultValue: 'Select your recovery kit PDF file to restore your account',
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>}

          {/* File Upload Area */}
          <div
            className="border-2 border-dashed border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isProcessing}
            />

            {isProcessing ? (
              <div className="space-y-2">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-muted-foreground">
                  {t('welcomeChoice.import.processingPDF', { defaultValue: 'Processing PDF...' })}
                </p>
                {fileName && <p className="text-sm text-muted-foreground">{fileName}</p>}
              </div>
            ) : (
              <div className="space-y-2">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto" />
                <p className="text-muted-foreground">
                  {t('welcomeChoice.import.clickToUpload', {
                    defaultValue: 'Click to upload PDF file',
                  })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('welcomeChoice.import.pdfHint', {
                    defaultValue: 'Select your Logikids Recovery Kit PDF',
                  })}
                </p>
              </div>
            )}
          </div>

          <Button variant="outline" onClick={onClose} className="w-full" disabled={isProcessing}>
            {t('welcomeChoice.import.cancel', { defaultValue: 'Cancel' })}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
