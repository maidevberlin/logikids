import { useTranslation } from 'react-i18next'
import { Heading } from '../components/base/Typography/Heading'
import { Breadcrumb } from '../components/base/Breadcrumb/Breadcrumb'
import { cn } from '../components/base/styles/utils'
import { useSettings } from '../hooks/useSettings'
import { container, background } from '../components/base/styles/common'
import { spacing } from '../components/base/styles'
import { PersonalInfo, LanguageSettings } from '../components/Account'

export default function AccountPage() {
  const { t } = useTranslation()
  const { settings, updateAge, updateName } = useSettings()

  return (
    <>
      <Breadcrumb currentPage={t('account.title')} />
      <div className={cn('min-h-screen py-12', background.solid.gray)}>
        <div className={cn(container.base, container.maxWidth.md)}>
          <div className={cn(
            'bg-white rounded-xl shadow-xl p-8',
            'transform transition-all duration-300'
          )}>
            <Heading level={1} className="mb-8">
              {t('account.title')}
            </Heading>

            <div className={cn(spacing.gap.lg, 'flex flex-col')}>
              <PersonalInfo
                name={settings.name}
                age={settings.age}
                onNameChange={updateName}
                onAgeChange={updateAge}
              />
              
              <LanguageSettings />
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 