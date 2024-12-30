import { useTranslation } from 'react-i18next'
import { Heading } from '../components/base/Typography/Heading'
import { Text } from '../components/base/Typography/Text'
import { Breadcrumb } from '../components/base/Breadcrumb/Breadcrumb'
import { cn } from '../components/base/styles/utils'
import { container, background } from '../components/base/styles/common'
import { useSettings } from '../hooks/useSettings'

export default function StatsPage() {
  const { t } = useTranslation()
  const { settings } = useSettings()

  return (
    <>
      <Breadcrumb currentPage={t('stats.title')} />
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
              {t('stats.title')}
            </Heading>

            <div className="space-y-6">
              {settings.name && (
                <Text size="lg">
                  {t('stats.greeting', { name: settings.name })}
                </Text>
              )}
              
              <div className="p-8 bg-gray-50 rounded-lg text-center">
                <Text className="text-gray-600">
                  {t('stats.comingSoon')}
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 