import { useTranslation } from 'react-i18next'
import { NumberInput } from '../components/base/Form/NumberInput'
import { Text } from '../components/base/Typography/Text'
import { Heading } from '../components/base/Typography/Heading'
import { Input } from '../components/base/Form/Input'
import { LanguageSwitcher } from '../components/base/LanguageSwitcher'
import { Breadcrumb } from '../components/base/Breadcrumb/Breadcrumb'
import { Age } from '../types/task'
import { spacing } from '../components/base/styles'
import { cn } from '../components/base/styles/utils'
import { useSettings } from '../hooks/useSettings'
import { container, background } from '../components/base/styles/common'

export default function AccountPage() {
  const { t } = useTranslation()
  const { settings, updateAge, updateName } = useSettings()

  return (
    <>
      <Breadcrumb currentPage={t('account.title')} />
      <div className={cn(
        'min-h-screen py-12',
        background.solid.gray
      )}>
        <div className={cn(
          container.base,
          container.maxWidth.md
        )}>
          <div className={cn(
            'bg-white rounded-xl shadow-xl p-8',
            'transform transition-all duration-300'
          )}>
            <Heading level={1} className="mb-8">
              {t('account.title')}
            </Heading>

            <div className={cn(spacing.gap.lg, 'flex flex-col')}>
              <Input
                type="text"
                value={settings.name}
                onChange={updateName}
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
                    value={Number(settings.age)}
                    onChange={(value) => updateAge(value as Age)}
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
          </div>
        </div>
      </div>
    </>
  )
} 