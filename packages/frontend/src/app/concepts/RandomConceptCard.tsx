import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { Sparkles } from 'lucide-react'
import { Concept } from './types'

export interface RandomConceptCardProps {
  subject: string
  concepts: Concept[]
}

export function RandomConceptCard({ subject, concepts }: RandomConceptCardProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleClick = () => {
    if (concepts.length === 0) return

    // Navigate to tasks with random concept (no specific concept selected)
    navigate(`/subjects/${subject}/random/tasks`)
  }

  if (concepts.length === 0) {
    return null
  }

  return (
    <Card
      onClick={handleClick}
      className="bg-card shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer h-full rounded-2xl border-2 border-dashed border-orange-300 hover:border-orange-400 hover:bg-orange-50/20"
    >
      <CardContent className="p-8 flex flex-col h-full relative">
        <div className="absolute top-4 right-4 animate-pulse">
          <Sparkles className="w-6 h-6 text-orange-500" />
        </div>
        <div className="flex flex-col h-full justify-center items-center text-center">
          <div className="text-5xl mb-3 animate-bounce">
            {t('concepts.surpriseMe.emoji', { defaultValue: '✨' })}
          </div>
          <h3 className="text-xl font-bold text-card-foreground mb-2">
            {t('concepts.surpriseMe.title', { defaultValue: 'Surprise Me!' })}
          </h3>
          <p className="text-muted-foreground">
            {t('concepts.surpriseMe.description', { defaultValue: 'Try a random concept' })}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
