import { useTranslation } from 'react-i18next'
import { PageLayout } from '@/app/common/PageLayout'
import { Card } from '@/components/ui/card'

export default function PrivacyPage() {
  const { t } = useTranslation()

  return (
    <PageLayout
      showHeader={true}
      showBack={true}
      showHome={true}
    >
      <div className="max-w-4xl mx-auto">
        <Card className="p-8 shadow-md rounded-2xl">
          <h1 className="text-3xl font-bold mb-6">{t('legal.privacy.title')}</h1>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold mb-3">{t('legal.privacy.intro.title')}</h2>
              <p className="mb-2">{t('legal.privacy.intro.paragraph1')}</p>
              <p>{t('legal.privacy.intro.paragraph2')}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('legal.privacy.dataCollection.title')}</h2>
              <p className="mb-3">{t('legal.privacy.dataCollection.description')}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>{t('legal.privacy.dataCollection.localOnly.title')}:</strong> {t('legal.privacy.dataCollection.localOnly.description')}</li>
                <li><strong>{t('legal.privacy.dataCollection.noTracking.title')}:</strong> {t('legal.privacy.dataCollection.noTracking.description')}</li>
                <li><strong>{t('legal.privacy.dataCollection.encrypted.title')}:</strong> {t('legal.privacy.dataCollection.encrypted.description')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('legal.privacy.encryption.title')}</h2>
              <p className="mb-2">{t('legal.privacy.encryption.paragraph1')}</p>
              <p>{t('legal.privacy.encryption.paragraph2')}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('legal.privacy.aiUsage.title')}</h2>
              <p className="mb-2">{t('legal.privacy.aiUsage.paragraph1')}</p>
              <p>{t('legal.privacy.aiUsage.paragraph2')}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('legal.privacy.gdprRights.title')}</h2>
              <p className="mb-3">{t('legal.privacy.gdprRights.description')}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>{t('legal.privacy.gdprRights.access.title')}:</strong> {t('legal.privacy.gdprRights.access.description')}</li>
                <li><strong>{t('legal.privacy.gdprRights.export.title')}:</strong> {t('legal.privacy.gdprRights.export.description')}</li>
                <li><strong>{t('legal.privacy.gdprRights.deletion.title')}:</strong> {t('legal.privacy.gdprRights.deletion.description')}</li>
                <li><strong>{t('legal.privacy.gdprRights.portability.title')}:</strong> {t('legal.privacy.gdprRights.portability.description')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('legal.privacy.dataRetention.title')}</h2>
              <p>{t('legal.privacy.dataRetention.description')}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('legal.privacy.thirdParty.title')}</h2>
              <p>{t('legal.privacy.thirdParty.description')}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('legal.privacy.changes.title')}</h2>
              <p>{t('legal.privacy.changes.description')}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('legal.privacy.contact.title')}</h2>
              <p>{t('legal.privacy.contact.description')}</p>
            </section>
          </div>
        </Card>
      </div>
    </PageLayout>
  )
}