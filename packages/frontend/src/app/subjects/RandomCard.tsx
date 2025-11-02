import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { Sparkles } from 'lucide-react'
import { useUserData } from '@/app/account'

export function RandomCard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: userData } = useUserData()

  const handleClick = () => {
    // Get random subject and navigate to it
    // We'll pick from available subjects
    const subjects = ['math', 'logic', 'physics', 'german', 'english', 'music']
    const randomSubject = subjects[Math.floor(Math.random() * subjects.length)]

    // Navigate to random subject with random=true flag to auto-select concept
    navigate(`/subjects/${randomSubject}?random=true`)
  }

  return (
    <Card
      onClick={handleClick}
      className="shadow-md hover:shadow-lg cursor-pointer hover:scale-[1.02] transition-all duration-300 h-full overflow-hidden rounded-2xl"
    >
      <CardContent className="h-full p-8 text-white bg-orange-500 hover:bg-orange-600 transition-colors duration-300 relative">
        <div className="absolute top-4 right-4 animate-pulse">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="flex flex-col h-full justify-center items-center text-center">
          <div className="text-6xl mb-4 animate-bounce">
            {t('subjects.surpriseMe.emoji', { defaultValue: '🎲' })}
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {t('subjects.surpriseMe.title', { defaultValue: 'Surprise Me!' })}
          </h2>
          <p className="text-white/90">
            {t('subjects.surpriseMe.description', { defaultValue: 'Jump into a random learning adventure' })}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
