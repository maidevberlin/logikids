import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/card'
import { GraduationCap, TrendingUp, User } from 'lucide-react'

export function NavigationCards() {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {/* Start Learning - Primary Card */}
      <Link to="/subjects" className="block md:col-span-3">
        <Card className="p-8 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer text-white hover:scale-[1.02] rounded-2xl">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-4 rounded-full">
              <GraduationCap className="w-12 h-12" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">
                {t('welcome.navigation.startLearning.title', { defaultValue: 'Start Learning' })}
              </h2>
              <p className="text-white/90 text-lg">
                {t('welcome.navigation.startLearning.description', {
                  defaultValue: 'Choose a subject and begin your learning journey'
                })}
              </p>
            </div>
          </div>
        </Card>
      </Link>

      {/* Progress Card */}
      <Link to="/stats" className="block">
        <Card className="p-6 bg-white shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-[1.02] rounded-2xl">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="bg-primary/10 p-4 rounded-full">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {t('welcome.navigation.progress.title', { defaultValue: 'Your Progress' })}
            </h3>
            <p className="text-gray-600">
              {t('welcome.navigation.progress.description', {
                defaultValue: 'See how you\'re doing and track your achievements'
              })}
            </p>
          </div>
        </Card>
      </Link>

      {/* Profile Card */}
      <Link to="/account" className="block">
        <Card className="p-6 bg-white shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-[1.02] rounded-2xl">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="bg-purple-100 p-4 rounded-full">
              <User className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {t('welcome.navigation.profile.title', { defaultValue: 'Profile' })}
            </h3>
            <p className="text-gray-600">
              {t('welcome.navigation.profile.description', {
                defaultValue: 'Manage your account and settings'
              })}
            </p>
          </div>
        </Card>
      </Link>
    </div>
  )
}
