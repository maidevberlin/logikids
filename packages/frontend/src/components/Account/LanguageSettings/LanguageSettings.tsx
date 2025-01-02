import { useTranslation } from 'react-i18next'
import { cn } from '../../../utils/cn'
import { LanguageSettingsProps } from './types'
import { styles } from './styles'
import { LanguageSwitcher } from '../../base/LanguageSwitcher'
import { Text } from '../../base/Typography'

export function LanguageSettings({ className }: LanguageSettingsProps) {
  const { t } = useTranslation()

  return (
    <div className={cn(styles.base, className)}>
      <Text className={styles.label}>
        {t('account.languageLabel')}
      </Text>
      <LanguageSwitcher />
    </div>
  )
} 