import { useTranslation } from 'react-i18next'
import { PersonalInfoProps } from './types'
import { styles } from './styles'
import { Input, NumberInput } from '../../base/Form'
import { Text } from '../../base/Typography'

export function PersonalInfo({ name, age, onNameChange, onAgeChange }: PersonalInfoProps) {
  const { t } = useTranslation()

  return (
    <div className={styles.base}>
      <div className={styles.field}>
        <Text className={styles.label}>
          {t('account.nameLabel')}
        </Text>
        <Input
          value={name}
          onChange={onNameChange}
          placeholder={t('account.namePlaceholder')}
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <Text className={styles.label}>
          {t('account.ageLabel')}
        </Text>
        <div className={styles.input}>
          <NumberInput
            value={age}
            onChange={onAgeChange}
            min={6}
            max={12}
          />
        </div>
      </div>
    </div>
  )
} 