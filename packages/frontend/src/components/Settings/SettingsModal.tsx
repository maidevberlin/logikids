import { useTranslation } from 'react-i18next'
import { NumberInput } from '../base/Form/NumberInput'
import { Text } from '../base/Typography/Text'
import { Heading } from '../base/Typography/Heading'
import { Input } from '../base/Form/Input'
import { LanguageSwitcher } from '../base/LanguageSwitcher'
import { Modal } from '../base/layout/Modal'
import { Age } from '../../types/task'
import { spacing } from '../base/styles'
import { cn } from '../base/styles/utils'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  age: Age
  name: string
  onAgeChange: (age: Age) => void
  onNameChange: (name: string) => void
}

export function SettingsModal({
  isOpen,
  onClose,
  age,
  name,
  onAgeChange,
  onNameChange,
}: SettingsModalProps) {
  const { t } = useTranslation()

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={<Heading level={3}>{t('settings.title')}</Heading>}
    >
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

        <div>
          <Text as="label" weight="medium">
            {t('settings.languageLabel')}
          </Text>
          <div className={cn(spacing.margin.sm)}>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </Modal>
  )
} 