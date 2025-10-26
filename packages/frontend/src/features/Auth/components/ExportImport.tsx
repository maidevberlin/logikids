import { useState, useRef } from 'react'
import { useUserData } from '../../UserData'

/**
 * Component for exporting and importing user data (GDPR data portability)
 */
export function ExportImport() {
  const { exportData, importData } = useUserData()
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  /**
   * Export user data as JSON file
   */
  const handleExport = async () => {
    try {
      setStatus('Exporting data...')
      setError(null)

      const json = await exportData()

      // Create JSON blob
      const blob = new Blob([json], { type: 'application/json' })

      // Create download link
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `logikids-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setStatus('Data exported successfully!')
      setTimeout(() => setStatus(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed')
      setStatus(null)
    }
  }

  /**
   * Import user data from JSON file
   */
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setStatus('Importing data...')
      setError(null)

      // Read file
      const text = await file.text()

      // Use the new importData function which handles validation and merging
      await importData(text)

      const imported = JSON.parse(text)
      setStatus(`Import complete! Merged ${Object.keys(imported.progress || {}).length} subjects.`)
      setTimeout(() => setStatus(null), 5000)

      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed')
      setStatus(null)

      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Data Portability</h3>
        <p className="text-sm text-gray-600 mb-4">
          Export your data for backup or import data from a previous export.
        </p>
      </div>

      {status && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          {status}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Export */}
        <div className="border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Export Data</h4>
          <p className="text-sm text-gray-600 mb-4">
            Download all your data as a JSON file for backup or transfer.
          </p>
          <button
            onClick={handleExport}
            className="w-full bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition"
          >
            📥 Export Data
          </button>
        </div>

        {/* Import */}
        <div className="border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Import Data</h4>
          <p className="text-sm text-gray-600 mb-4">
            Import data from a previous export. Progress will be merged.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImport}
            className="hidden"
            id="import-file"
          />
          <label
            htmlFor="import-file"
            className="block w-full bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600 transition text-center cursor-pointer"
          >
            📤 Import Data
          </label>
        </div>
      </div>

      <div className="text-xs text-gray-500 space-y-1">
        <p><strong>Export:</strong> Downloads a JSON file with all your unencrypted data.</p>
        <p><strong>Import:</strong> Merges progress from backup file (adds up task counts).</p>
      </div>
    </div>
  )
}
