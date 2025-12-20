import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// Valid subject namespaces that can be lazy-loaded
const SUBJECT_NAMESPACES = [
  'subjects/math',
  'subjects/german',
  'subjects/english',
  'subjects/history',
  'subjects/physics',
  'subjects/biology',
  'subjects/logic',
] as const

type SubjectNamespace = (typeof SUBJECT_NAMESPACES)[number]

/**
 * Lazy-loads translations for a specific subject.
 * Call this hook when entering a subject-specific route to load
 * the translations on-demand instead of at app init.
 *
 * @param subject - The subject identifier (e.g., 'math', 'german')
 * @returns { isLoading, isLoaded } - Loading state for the translations
 */
export function useSubjectTranslations(subject: string | undefined) {
  const { i18n } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!subject) {
      setIsLoaded(true)
      return
    }

    const namespace = `subjects/${subject}` as SubjectNamespace

    // Check if this is a valid subject namespace
    if (!SUBJECT_NAMESPACES.includes(namespace)) {
      setIsLoaded(true)
      return
    }

    // Check if already loaded
    if (i18n.hasLoadedNamespace(namespace)) {
      setIsLoaded(true)
      return
    }

    setIsLoading(true)
    setIsLoaded(false)

    i18n
      .loadNamespaces(namespace)
      .then(() => {
        setIsLoaded(true)
      })
      .catch((error) => {
        console.error(`Failed to load translations for ${namespace}:`, error)
        setIsLoaded(true) // Continue even if loading fails
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [subject, i18n])

  return { isLoading, isLoaded }
}

/**
 * Lazy-loads translations for multiple subjects at once.
 * Useful for pages that display data from multiple subjects (e.g., PracticePage).
 *
 * @param subjects - Array of subject identifiers
 * @returns { isLoading, isLoaded } - Loading state for all translations
 */
export function useMultipleSubjectTranslations(subjects: string[]) {
  const { i18n } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (subjects.length === 0) {
      setIsLoaded(true)
      return
    }

    // Filter to valid namespaces that aren't already loaded
    const namespacesToLoad = subjects
      .map((s) => `subjects/${s}` as SubjectNamespace)
      .filter((ns) => SUBJECT_NAMESPACES.includes(ns) && !i18n.hasLoadedNamespace(ns))

    if (namespacesToLoad.length === 0) {
      setIsLoaded(true)
      return
    }

    setIsLoading(true)
    setIsLoaded(false)

    i18n
      .loadNamespaces(namespacesToLoad)
      .then(() => {
        setIsLoaded(true)
      })
      .catch((error) => {
        console.error('Failed to load translations for subjects:', error)
        setIsLoaded(true)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [subjects.join(','), i18n]) // Join subjects for stable dependency

  return { isLoading, isLoaded }
}
