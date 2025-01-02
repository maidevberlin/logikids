import { useTranslation } from 'react-i18next'
import { Heading } from '../../base/Typography/Heading'
import { Breadcrumb } from '../../base/Breadcrumb/Breadcrumb'
import { PersonalInfo, LanguageSettings } from '..'
import { Page } from '../../base/Layout'
import { Container } from '../../base/Layout/Container'
import { Section } from '../../base/Layout/Section'
import { useSettings } from '../../Settings/useSettings'
import { cn } from '../../../utils/cn'
import { styles } from './styles'
import type { AccountPageProps } from './types'

export default function AccountPage({}: AccountPageProps) {
  const { t } = useTranslation()
  const { settings, updateAge, updateName } = useSettings()

  return (
    <Page>
      <Breadcrumb currentPage={t('account.title')} />
      <Section>
        <Container maxWidth="md">
          <div className={cn(styles.card)}>
            <Heading level={1} className={styles.title}>
              {t('account.title')}
            </Heading>

            <div className={styles.content}>
              <PersonalInfo
                name={settings.name}
                age={settings.age}
                onNameChange={updateName}
                onAgeChange={updateAge}
              />
              
              <LanguageSettings />
            </div>
          </div>
        </Container>
      </Section>
    </Page>
  )
} 