import { useTranslation } from 'react-i18next'
import { Input, NumberInput, FormField, Select } from '../../base/Form'
import { useUserData } from '../../UserData'
import { styles } from './styles'
import { GENDERS } from '../../../api/logikids'

const languages = [
  { value: 'en', label: '🇬🇧 English' },
  { value: 'de', label: '🇩🇪 Deutsch' }
]

export function SettingsForm() {
  const { t, i18n } = useTranslation()
  const { data, updateSettings } = useUserData()

  const genderOptions = [
    { value: '', label: t('settings.gender.notSpecified') },
    ...GENDERS.map(g => ({ value: g, label: t(`settings.gender.options.${g}`) }))
  ]

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang)
    updateSettings({ language: lang })
  }

  if (!data) return null

  return (
    <div className={styles.base}>
      <FormField label={t('settings.nameLabel')}>
        <Input
          value={data.settings.name}
          onChange={(name) => updateSettings({ name })}
          placeholder={t('settings.namePlaceholder')}
          className={styles.input}
        />
      </FormField>

      <FormField label={t('settings.gradeLabel')}>
        <NumberInput
          value={data.settings.grade}
          onChange={(grade) => updateSettings({ grade })}
          min={1}
          max={13}
        />
      </FormField>

      <FormField label={t('settings.languageLabel')}>
        <Select
          value={data.settings.language}
          options={languages}
          onChange={handleLanguageChange}
          className={styles.input}
        />
      </FormField>

      <FormField label={t('settings.gender.label')}>
        <Select
          value={data.settings.gender || ''}
          options={genderOptions}
          onChange={(value) => updateSettings({ gender: value || undefined })}
          className={styles.input}
        />
      </FormField>
    </div>
  )
} 