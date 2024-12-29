import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Welcome() {
  const { t } = useTranslation()

  return (
    <div className="flex items-center justify-center p-4 min-h-screen">
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full transform transition-all hover:scale-105">
        <h1 className="text-4xl font-bold text-blue-800 mb-6 text-center">
          {t('welcome.title')}
        </h1>
        <p className="text-gray-600 text-center text-lg">
          {t('welcome.subtitle')}
        </p>
        <Link
          to="/tasks"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          {t('welcome.startButton')}
        </Link>
      </div>
    </div>
  )
} 