import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { exportData } from '@/data/plugins/export'
import { Button } from '@/app/common/ui/button'
import { Download } from 'lucide-react'
import { createLogger } from '@/lib/logger'

const logger = createLogger('ExportData')

/**
 * Component for exporting user data as JSON
 * Allows users to download their data for portability and backup
 */
export function ExportData() {
  const { t } = useTranslation('profile')
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleExport = async () => {
    setIsExporting(true)
    setError(null)

    try {
      // Get data as JSON string
      const jsonData = await exportData()

      // Create blob and download
      const blob = new Blob([jsonData], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `logikids-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export data')
      logger.error('Data export failed', err as Error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-2">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}

      <Button
        onClick={handleExport}
        variant="outline"
        className="w-full justify-start"
        disabled={isExporting}
      >
        <Download className="w-4 h-4 mr-2" />
        {isExporting
          ? t('account.exportData.exporting', { defaultValue: 'Exporting...' })
          : t('account.exportData.downloadButton', { defaultValue: 'Export Data (JSON)' })
        }
      </Button>

      <p className="text-xs text-muted-foreground">
        {t('account.exportData.description', {
          defaultValue: 'Download all your data as a JSON file. You can use this for backups or to transfer your data.'
        })}
      </p>
    </div>
  )
}
