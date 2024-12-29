import { useTranslation } from 'react-i18next'
import { Select } from './Form'

const languages = [
  { value: 'en', label: 'English' },
  { value: 'de', label: 'Deutsch' }
]

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  return (
    <Select
      value={i18n.language}
      options={languages}
      onChange={(lang) => i18n.changeLanguage(lang)}
      size="sm"
    />
  )
} 