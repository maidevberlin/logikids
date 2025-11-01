import { useTranslation } from 'react-i18next'
import { PageLayout } from '@/app/common/PageLayout'
import { Card } from '@/components/ui/card'

export default function ImpressumPage() {
  const { t } = useTranslation()

  return (
    <PageLayout
      showHeader={true}
      showBack={true}
      showHome={true}
    >
      <div className="max-w-4xl mx-auto">
        <Card className="p-8 shadow-md rounded-2xl">
          <h1 className="text-3xl font-bold mb-6">{t('legal.impressum.title')}</h1>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold mb-3">{t('legal.impressum.provider.title')}</h2>
              <div className="space-y-1">
                <p><strong>{t('legal.impressum.provider.name')}:</strong> Maik Maibaum</p>
                <p><strong>{t('legal.impressum.provider.address')}:</strong> Fischerinsel 5</p>
                <p><strong>{t('legal.impressum.provider.city')}:</strong> 10179 Berlin</p>
                <p><strong>{t('legal.impressum.provider.country')}:</strong> Deutschland</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('legal.impressum.contact.title')}</h2>
              <div className="space-y-1">
                <p><strong>{t('legal.impressum.contact.email')}:</strong> lamaberlin@gmail.com</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('legal.impressum.responsible.title')}</h2>
              <p>{t('legal.impressum.responsible.description')}</p>
              <p className="mt-2">Maik Maibaum</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('legal.impressum.disclaimer.title')}</h2>

              <h3 className="font-semibold mt-4 mb-2">{t('legal.impressum.disclaimer.content.title')}</h3>
              <p className="mb-4">{t('legal.impressum.disclaimer.content.description')}</p>

              <h3 className="font-semibold mt-4 mb-2">{t('legal.impressum.disclaimer.links.title')}</h3>
              <p>{t('legal.impressum.disclaimer.links.description')}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t('legal.impressum.euDispute.title')}</h2>
              <p className="mb-2">{t('legal.impressum.euDispute.paragraph1')}</p>
              <p>
                {t('legal.impressum.euDispute.paragraph2')}
                {' '}
                <a
                  href="https://ec.europa.eu/consumers/odr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  https://ec.europa.eu/consumers/odr
                </a>
              </p>
            </section>
          </div>
        </Card>
      </div>
    </PageLayout>
  )
}
