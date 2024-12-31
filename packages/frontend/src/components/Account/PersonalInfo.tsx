import { useTranslation } from 'react-i18next'
import { Input } from '../base/Form/Input'
import { NumberInput } from '../base/Form/NumberInput'
import { Text } from '../base/Typography/Text'
import { spacing } from '../base/styles'
import { cn } from '../base/styles/utils'
import { Age } from '@logikids/backend/tasks/types'

interface PersonalInfoProps {
  name: string
  age: number
  onNameChange: (name: string) => void
  onAgeChange: (age: Age) => void
}

export const PersonalInfo = ({ name, age, onNameChange, onAgeChange }: PersonalInfoProps) => {
  const { t } = useTranslation()

  return (
    <div className={cn(spacing.gap.lg, 'flex flex-col')}>
      <Input
        type="text"
        value={name}
        onChange={onNameChange}
        label={t('settings.nameLabel')}
        placeholder={t('settings.namePlaceholder')}
        fullWidth
      />

      <div>
        <Text as="label" htmlFor="age" weight="medium">
          {t('settings.ageLabel')}
        </Text>
        <div className={cn(spacing.margin.sm)}>
          <NumberInput
            value={Number(age)}
            onChange={(value) => onAgeChange(value as Age)}
            min={6}
            max={20}
          />
        </div>
      </div>
    </div>
  )
} 