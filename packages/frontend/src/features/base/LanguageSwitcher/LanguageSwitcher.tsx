import { useTranslation } from 'react-i18next'
import { Select } from '../Form'
import { useUserData } from '../../Auth/context/UserDataContext'
import { LanguageSwitcherProps } from './types'

const languages = [
  { value: 'en', label: 'English' },
  { value: 'de', label: 'Deutsch' }
]

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { i18n } = useTranslation()
  const { settings, updateLanguage } = useUserData()

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