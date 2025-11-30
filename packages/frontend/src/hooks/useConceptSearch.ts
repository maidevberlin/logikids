import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface ConceptTranslation {
  name?: string
  description?: string
}

/**
 * Search concepts by name and description using i18n translations.
 * Returns null when query is empty (show all), or a Set of matching concept IDs.
 */
export function useConceptSearch(query: string, subject: string): Set<string> | null {
  const { i18n } = useTranslation()

  return useMemo(() => {
    const trimmedQuery = query.trim()
    if (!trimmedQuery) return null // null = no filter (show all)

    const bundle = i18n.getResourceBundle(i18n.language, `subjects/${subject}`)
    const concepts = (bundle?.concepts ?? {}) as Record<string, ConceptTranslation>
    const searchLower = trimmedQuery.toLowerCase()

    const matches = new Set<string>()
    for (const [id, data] of Object.entries(concepts)) {
      if (
        data.name?.toLowerCase().includes(searchLower) ||
        data.description?.toLowerCase().includes(searchLower)
      ) {
        matches.add(id)
      }
    }
    return matches
  }, [query, subject, i18n, i18n.language])
}
