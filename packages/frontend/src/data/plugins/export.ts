import { UserData } from '../core/types.ts'
import { getData, setData } from '../core/userData.ts'

/**
 * Export user data as unencrypted JSON string
 */
export async function exportData(): Promise<string> {
  const data = await getData()
  return JSON.stringify(data, null, 2)
}

/**
 * Import user data from JSON string
 * Merges progress additively (never loses data)
 */
export async function importData(json: string): Promise<void> {
  const imported: UserData = JSON.parse(json)
  const current = await getData()

  // Merge progress additively
  const mergedProgress = mergeProgress(current.progress, imported.progress)

  const merged: UserData = {
    ...imported,
    progress: mergedProgress,
    timestamp: Date.now()
  }

  await setData(merged)
}

/**
 * Deep merge progress, keeping all data from both sources
 */
function mergeProgress(
  current: Record<string, any>,
  imported: Record<string, any>
): Record<string, any> {
  const result = { ...current }

  for (const key in imported) {
    if (imported[key] && typeof imported[key] === 'object' && !Array.isArray(imported[key])) {
      result[key] = mergeProgress(result[key] || {}, imported[key])
    } else {
      // Prefer imported value if it exists
      result[key] = imported[key]
    }
  }

  return result
}
