import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import { Heading } from '../../base/Typography/Heading'
import { Breadcrumb } from '../../base/Breadcrumb/Breadcrumb'
import { SettingsForm } from '../SettingsForm'
import { Page } from '../../base/Layout'
import { Container } from '../../base/Layout/Container'
import { cn } from '../../../utils/cn'
import { styles } from './styles'
import type { AccountPageProps } from './types'

export default function AccountPage({}: AccountPageProps) {
  const { t } = useTranslation()

  const navigation = useMemo(() => (
    <Breadcrumb currentPage={t('account.title')} />
  ), [t])

  return (
    <Page navigation={navigation}>
      <div className={styles.container}>
        <Container maxWidth="md">
          <div className={cn(styles.card)}>
            <Heading level={1} className={styles.title}>
              {t('account.title')}
            </Heading>

            <div className={styles.content}>
              <SettingsForm />
            </div>
          </div>
        </Container>
      </div>
    </Page>
  )
} 