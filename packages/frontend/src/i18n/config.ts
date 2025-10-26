import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'

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
  console.warn('Could not access localStorage:', error)
}

// Use stored language first, then browser language, then fallback to English
const initialLanguage = storedLanguage || getBrowserLanguage() || 'en'

// Export for use in other parts of the application
export const getCurrentLanguage = () => i18n.language

// Cache breaker using content hash - only changes when translations change
const CACHE_BREAKER = import.meta.env.VITE_TRANSLATIONS_HASH

i18n
  // Load translations using http -> see /public/locales
  .use(Backend)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  .init({
    // Use stored language or fallback to English
    lng: initialLanguage,
    fallbackLng: 'en',
    // Debug mode in development
    debug: import.meta.env.DEV,
    // Namespace
    defaultNS: 'common',
    ns: ['common'],
    // Backend configuration for lazy loading
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json?h=' + CACHE_BREAKER,
    },
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  })

export default i18n 