/**
 * Supported languages - single source of truth
 * Add new languages here; check:translations will fail until translations exist
 *
 * When adding a new language:
 * 1. Add entry here with label, flag, and displayName
 * 2. Add translations in packages/frontend/public/locales/{lang}/
 * 3. Add TTS voice config in packages/backend/src/tts/service.ts (if TTS needed)
 */
export const LANGUAGES = {
  ar: { label: 'العربية', countryCode: 'SA', displayName: 'Arabic' },
  de: { label: 'Deutsch', countryCode: 'DE', displayName: 'German' },
  en: { label: 'English', countryCode: 'GB', displayName: 'English' },
  tr: { label: 'Türkçe', countryCode: 'TR', displayName: 'Turkish' },
  uk: { label: 'Українська', countryCode: 'UA', displayName: 'Ukrainian' },
  vi: { label: 'Tiếng Việt', countryCode: 'VN', displayName: 'Vietnamese' },
} as const

export type Language = keyof typeof LANGUAGES
export const SUPPORTED_LANGUAGES = Object.keys(LANGUAGES) as [Language, ...Language[]]
export const DEFAULT_LANGUAGE: Language = 'en'
