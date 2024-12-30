import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'

// Get browser language
const getBrowserLanguage = () => {
  return navigator.language.split('-')[0] // Get primary language code
}

// Get language from settings if available
const STORAGE_KEY = 'logikids_settings'
const storedSettings = localStorage.getItem(STORAGE_KEY)
const storedLanguage = storedSettings 
  ? JSON.parse(storedSettings).language 
  : null

// Use stored language first, then browser language, then fallback to English
const initialLanguage = storedLanguage || getBrowserLanguage() || 'en'

// Export for use in other parts of the application
export const getCurrentLanguage = () => i18n.language

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
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  })

export default i18n 