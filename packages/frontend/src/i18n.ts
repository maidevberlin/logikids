import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import { createLogger } from '@/app/common/logger.ts'
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, type Language } from '/content/languages'

const logger = createLogger('i18nConfig')

// Get browser language
const getBrowserLanguage = () => {
  return navigator.language.split('-')[0] // Get primary language code
}

// Get language from settings if available
let storedLanguage = null

try {
  // Try to get from encrypted user data first
  const userData = localStorage.getItem('logikids_data')
  if (userData) {
    const parsed = JSON.parse(userData)
    storedLanguage = parsed.settings?.language || null
  }

  // Fallback to old settings key for migration
  if (!storedLanguage) {
    const oldSettings = localStorage.getItem('logikids_settings')
    if (oldSettings) {
      storedLanguage = JSON.parse(oldSettings).language
    }
  }
} catch (error) {
  logger.warn('Could not access localStorage', { error })
}

// Use stored language first, then browser language, then fallback to default
const browserLang = getBrowserLanguage()
const validBrowserLang = SUPPORTED_LANGUAGES.includes(browserLang as any) ? browserLang : null
const initialLanguage = storedLanguage || validBrowserLang || DEFAULT_LANGUAGE

// Export for use in other parts of the application
export const getCurrentLanguage = (): Language => {
  const lang = i18n.language
  // Validate and return a supported language, or fallback to default
  return SUPPORTED_LANGUAGES.includes(lang as Language) ? (lang as Language) : DEFAULT_LANGUAGE
}

// Cache breaker using content hash - only changes when translations change
const CACHE_BREAKER = import.meta.env.VITE_TRANSLATIONS_HASH

void i18n
  // Load translations using http -> see /public/locales
  .use(Backend)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  .init({
    // Use stored language or fallback to English
    lng: initialLanguage,
    fallbackLng: DEFAULT_LANGUAGE,
    // Debug mode disabled to reduce console noise
    debug: false,
    // Namespace - only load core namespaces initially
    // Subject namespaces are loaded on-demand via useSubjectTranslations hook
    defaultNS: 'common',
    ns: ['common', 'greetings', 'profile', 'stats', 'loading'],
    // Backend configuration for lazy loading
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json?h=' + CACHE_BREAKER,
    },
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  })

export { i18n }
