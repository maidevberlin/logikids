/**
 * Supported languages - single source of truth
 * Add new languages here; check:translations will fail until translations exist
 *
 * When adding a new language:
 * 1. Add entry here with label, countryCode, displayName, and tts config
 * 2. Add translations in packages/frontend/public/locales/{lang}/
 * 3. Add backend locale in packages/backend/locales/{lang}/
 */
export const LANGUAGES = {
  ar: {
    label: 'العربية',
    countryCode: 'SA',
    displayName: 'Arabic',
    tts: { languageCode: 'ar-XA', envVar: 'TTS_VOICE_AR', defaultVoice: 'ar-XA-Standard-A' },
  },
  de: {
    label: 'Deutsch',
    countryCode: 'DE',
    displayName: 'German',
    tts: { languageCode: 'de-DE', envVar: 'TTS_VOICE_DE', defaultVoice: 'de-DE-Standard-A' },
  },
  en: {
    label: 'English',
    countryCode: 'GB',
    displayName: 'English',
    tts: { languageCode: 'en-US', envVar: 'TTS_VOICE_EN', defaultVoice: 'en-US-Standard-C' },
  },
  tr: {
    label: 'Türkçe',
    countryCode: 'TR',
    displayName: 'Turkish',
    tts: { languageCode: 'tr-TR', envVar: 'TTS_VOICE_TR', defaultVoice: 'tr-TR-Standard-A' },
  },
  uk: {
    label: 'Українська',
    countryCode: 'UA',
    displayName: 'Ukrainian',
    tts: { languageCode: 'uk-UA', envVar: 'TTS_VOICE_UK', defaultVoice: 'uk-UA-Standard-A' },
  },
  vi: {
    label: 'Tiếng Việt',
    countryCode: 'VN',
    displayName: 'Vietnamese',
    tts: { languageCode: 'vi-VN', envVar: 'TTS_VOICE_VI', defaultVoice: 'vi-VN-Standard-A' },
  },
} as const

export type Language = keyof typeof LANGUAGES
export const SUPPORTED_LANGUAGES = Object.keys(LANGUAGES) as [Language, ...Language[]]
export const DEFAULT_LANGUAGE: Language = 'en'
