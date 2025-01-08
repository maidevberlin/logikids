import { useTranslation } from 'react-i18next'
import { Input, NumberInput, FormField, Select } from '../../base/Form'
import { useSettings } from '../Settings/useSettings'
import { styles } from './styles'

const languages = [
  { value: 'en', label: 'English' },
  { value: 'de', label: 'Deutsch' }
]

export function SettingsForm() {
  const { t, i18n } = useTranslation()
  const { settings, updateName, updateAge, updateLanguage } = useSettings()

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang)
    updateLanguage(lang)
  }

  return (
    <div className={styles.base}>
      <FormField label={t('settings.nameLabel')}>
        <Input
          value={settings.name}
          onChange={updateName}
          placeholder={t('settings.namePlaceholder')}
          className={styles.input}
        />
      </FormField>

      <FormField label={t('settings.ageLabel')}>
        <NumberInput
          value={settings.age}
          onChange={updateAge}
          min={6}
          max={20}
        />
      </FormField>

      <FormField label={t('settings.languageLabel')}>
        <Select
          value={settings.language}
          options={languages}
          onChange={handleLanguageChange}
          className={styles.input}
        />
      </FormField>
    </div>
  )
} 