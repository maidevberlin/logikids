import { useTranslation } from 'react-i18next'
import { Select } from '../Form'
import { useSettings } from '../../Settings/useSettings'
import { LanguageSwitcherProps } from './types'
import { cn } from '../../../utils/cn'
import { styles } from './styles'

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
    <div className={cn(styles.base, className)}>
      <Select
        value={settings.language}
        options={languages}
        onChange={handleLanguageChange}
        size="sm"
        className={styles.select}
      />
    </div>
  )
} 