import { useTranslation } from 'react-i18next'
import { Select } from '../Form'
import { useUserData } from '../../UserData'
import { LanguageSwitcherProps } from './types'

const languages = [
  { value: 'en', label: 'English' },
  { value: 'de', label: 'Deutsch' }
]

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { i18n } = useTranslation()
  const { data, updateSettings } = useUserData()

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang)
    updateSettings({ language: lang })
  }

  if (!data) return null

  return (
    <Select
      value={data.settings.language}
      options={languages}
      onChange={handleLanguageChange}
      className={className}
    />
  )
} 