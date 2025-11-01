import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export function Footer() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-6xl mx-auto px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <div>
            © {currentYear} Logikids. {t('footer.allRightsReserved')}
          </div>
          <div className="flex gap-6">
            <Link
              to="/privacy"
              className="hover:text-gray-900 transition-colors"
            >
              {t('footer.privacyPolicy')}
            </Link>
            <Link
              to="/impressum"
              className="hover:text-gray-900 transition-colors"
            >
              {t('footer.impressum')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
