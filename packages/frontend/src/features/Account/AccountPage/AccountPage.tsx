import { useTranslation } from 'react-i18next'
import { useMemo, useState } from 'react'
import { UserCircleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import { Heading } from '../../base/Typography/Heading'
import { Breadcrumb } from '../../base/Breadcrumb/Breadcrumb'
import { SettingsForm } from '../SettingsForm'
import { ExportImport } from '../../Auth/components/ExportImport'
import { QRPairing } from '../../Auth/components/QRPairing'
import { RecoveryKit } from '../../Auth/components/RecoveryKit'
import { Page } from '../../base/Layout'
import { Container } from '../../base/Layout/Container'
import { cn } from '../../../utils/cn'
import { styles } from './styles'
import type { AccountPageProps } from './types'
import { useUserData } from '../../UserData'

export default function AccountPage({}: AccountPageProps) {
  const { t } = useTranslation()
  const { data } = useUserData()
  const [activeSecurityTab, setActiveSecurityTab] = useState<'export' | 'qr' | 'recovery'>('export')

  const navigation = useMemo(() => (
    <Breadcrumb currentPage={t('account.title')} />
  ), [t])

  return (
    <Page navigation={navigation}>
      <div className={styles.container}>
        <Container maxWidth="md">
          {/* Settings Card */}
          <div className={cn(styles.card)}>
            <Heading level={1} className={styles.title}>
              <UserCircleIcon className={styles.icon} />
              {t('account.title')}
            </Heading>

            <div className={styles.content}>
              <SettingsForm />
            </div>
          </div>

          {/* Security & Backup Card */}
          {data && (
            <div className={cn(styles.card, 'mt-6')}>
              <Heading level={2} className={styles.title}>
                <ShieldCheckIcon className={styles.icon} />
                {t('account.security.title', { defaultValue: 'Security & Backup' })}
              </Heading>

              <div className={styles.content}>
                <p className="text-sm text-gray-600 mb-4">
                  {t('account.security.description', {
                    defaultValue: 'Your data is encrypted end-to-end. Use these tools to manage your encryption keys and backups.'
                  })}
                </p>

                {/* Tabs */}
                <div className="flex border-b mb-6">
                  <button
                    onClick={() => setActiveSecurityTab('export')}
                    className={cn(
                      'flex-1 px-4 py-3 font-medium text-sm',
                      activeSecurityTab === 'export'
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    )}
                  >
                    {t('account.security.exportImport', { defaultValue: 'Export/Import' })}
                  </button>
                  <button
                    onClick={() => setActiveSecurityTab('qr')}
                    className={cn(
                      'flex-1 px-4 py-3 font-medium text-sm',
                      activeSecurityTab === 'qr'
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    )}
                  >
                    {t('account.security.qrPairing', { defaultValue: 'QR Pairing' })}
                  </button>
                  <button
                    onClick={() => setActiveSecurityTab('recovery')}
                    className={cn(
                      'flex-1 px-4 py-3 font-medium text-sm',
                      activeSecurityTab === 'recovery'
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    )}
                  >
                    {t('account.security.recoveryKit', { defaultValue: 'Recovery Kit' })}
                  </button>
                </div>

                {/* Tab Content */}
                <div>
                  {activeSecurityTab === 'export' && <ExportImport />}
                  {activeSecurityTab === 'qr' && <QRPairing />}
                  {activeSecurityTab === 'recovery' && <RecoveryKit />}
                </div>
              </div>
            </div>
          )}
        </Container>
      </div>
    </Page>
  )
} 