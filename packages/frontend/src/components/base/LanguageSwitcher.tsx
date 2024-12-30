import { useTranslation } from 'react-i18next'
import { Select } from './Form'
import { useSettings } from '../../hooks/useSettings'

const languages = [
  { value: 'en', label: 'English' },
  { value: 'de', label: 'Deutsch' }
]

export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const { settings, updateLanguage } = useSettings()

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang)
    updateLanguage(lang)
  }

  return (
    <Select
      value={settings.language}
      options={languages}
      onChange={handleLanguageChange}
      size="sm"
    />
  )
} 