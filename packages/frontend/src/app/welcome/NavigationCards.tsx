import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/card'
import { BookOpen, Target, Calendar } from 'lucide-react'
import { ContinueLearningCard } from './ContinueLearningCard'

export function NavigationCards() {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {/* Continue Learning - Primary Card */}
      <ContinueLearningCard />

      {/* Browse Subjects Card */}
      <Link to="/subjects" className="block">
        <Card className="p-6 bg-white shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-[1.02] rounded-2xl h-full">
          <div className="flex flex-col items-center text-center space-y-3 h-full justify-center">
            <div className="bg-primary/10 p-4 rounded-full">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {t('welcome.navigation.browseSubjects.title', { defaultValue: 'Browse Subjects' })}
            </h3>
            <p className="text-gray-600">
              {t('welcome.navigation.browseSubjects.description', {
                defaultValue: 'Explore all subjects and concepts'
              })}
            </p>
          </div>
        </Card>
      </Link>

      {/* Practice Mode Card */}
      <Link to="/subjects" className="block">
        <Card className="p-6 bg-white shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-[1.02] rounded-2xl h-full">
          <div className="flex flex-col items-center text-center space-y-3 h-full justify-center">
            <div className="bg-orange-100 p-4 rounded-full">
              <Target className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {t('welcome.navigation.practiceMode.title', { defaultValue: 'Practice Mode' })}
            </h3>
            <p className="text-gray-600">
              {t('welcome.navigation.practiceMode.description', {
                defaultValue: 'Focus on concepts that need improvement'
              })}
            </p>
          </div>
        </Card>
      </Link>

      {/* Daily Challenge Card */}
      <Link to="/subjects" className="block">
        <Card className="p-6 bg-white shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-[1.02] rounded-2xl h-full">
          <div className="flex flex-col items-center text-center space-y-3 h-full justify-center">
            <div className="bg-purple-100 p-4 rounded-full">
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {t('welcome.navigation.dailyChallenge.title', { defaultValue: 'Daily Challenge' })}
            </h3>
            <p className="text-gray-600">
              {t('welcome.navigation.dailyChallenge.description', {
                defaultValue: 'Complete today\'s special task'
              })}
            </p>
          </div>
        </Card>
      </Link>
    </div>
  )
}
