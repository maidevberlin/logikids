import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Github } from 'lucide-react'

export function Footer() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-6xl mx-auto px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div>
            © {currentYear} Logikids. {t('footer.allRightsReserved')}
          </div>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              {t('footer.privacyPolicy')}
            </Link>
            <Link to="/impressum" className="hover:text-foreground transition-colors">
              {t('footer.impressum')}
            </Link>
            <a
              href="https://github.com/maidevberlin/logikids"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
