import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Concept } from './types'
import { useProgress } from '@/data/progress/hooks'
import { calculateConceptStars } from '@/data/progress/mastery'
import { StarRating } from '@/components/ui/star-rating'
import { formatGrade } from '@/lib/formatGrade'

const difficultyColors: Record<string, string> = {
  easy: 'bg-green-50 text-green-700',
  medium: 'bg-amber-50 text-amber-700',
  hard: 'bg-red-50 text-red-700',
}

export interface ConceptCardProps {
  concept: Concept
  subject: string
  isAdvanced?: boolean
}

export function ConceptCard({ concept, subject, isAdvanced }: ConceptCardProps) {
  const { t } = useTranslation()
  const { progress } = useProgress()

  // Calculate mastery stars
  const conceptStats = progress?.[subject]?.[concept.id]
  const masteryStars = calculateConceptStars(conceptStats)

  // Get translated values with fallback to backend data
  const name = t(`subjects/${subject}:concepts.${concept.id}.name`, { defaultValue: concept.name })
  const description = t(`subjects/${subject}:concepts.${concept.id}.description`, { defaultValue: concept.description })

  return (
    <Link to={`/subjects/${subject}/${concept.id}/tasks`}>
      <Card className={`relative bg-card shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer h-full rounded-2xl hover:-translate-y-1 ${
        isAdvanced ? 'ring-2 ring-orange-300 bg-orange-50/20' : ''
      }`}>
        {/* Star rating in top-right corner */}
        <div className="absolute top-4 right-4">
          <StarRating stars={masteryStars} size="md" />
        </div>

        <CardContent className="p-8 flex flex-col h-full">
          <h3 className="text-xl font-bold text-card-foreground mb-3">
            {name}
          </h3>

          <p className="text-muted-foreground mb-4 flex-1">{description}</p>

          <div className="flex flex-wrap gap-2">
            {concept.grade && (
              <Badge className="bg-blue-100 text-blue-800 rounded-lg pointer-events-none">
                {formatGrade(concept.grade, t)}
              </Badge>
            )}
            {isAdvanced && (
              <Badge className="bg-orange-100 text-orange-800 rounded-lg pointer-events-none">
                {t('concepts.advanced')}
              </Badge>
            )}
            {concept.difficulty && (
              <Badge className={`rounded-lg pointer-events-none ${difficultyColors[concept.difficulty]}`}>
                {t(`difficulty.${concept.difficulty}`)}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
