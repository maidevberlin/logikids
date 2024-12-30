import { useTranslation } from 'react-i18next'
import { Text } from '../base/Typography/Text'
import { LanguageSwitcher } from '../base/LanguageSwitcher'
import { spacing } from '../base/styles'
import { cn } from '../base/styles/utils'

export const LanguageSettings = () => {
  const { t } = useTranslation()

  return (
    <div>
      <Text as="label" weight="medium">
        {t('settings.languageLabel')}
      </Text>
      <div className={cn(spacing.margin.sm)}>
        <LanguageSwitcher />
      </div>
    </div>
  )
} 