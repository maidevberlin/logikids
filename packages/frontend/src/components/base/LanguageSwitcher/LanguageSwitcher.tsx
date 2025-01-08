import { useTranslation } from 'react-i18next'
import { Select } from '../Form'
import { useSettings } from '../../Account/Settings/useSettings'
import { LanguageSwitcherProps } from './types'

const languages = [
  { value: 'en', label: 'English' },
  { value: 'de', label: 'Deutsch' }
]

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
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
      className={className}
    />
  )
} 