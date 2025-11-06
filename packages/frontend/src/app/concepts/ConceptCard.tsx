import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Concept } from './types'
import { getSubjectNamespace } from '@/i18n/subjectNamespace'

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
  const namespace = getSubjectNamespace(subject, concept.grade)

  // Get translated values with fallback to backend data
  const name = t(`${namespace}:concepts.${concept.id}.name`, { defaultValue: concept.name })
  const description = t(`${namespace}:concepts.${concept.id}.description`, { defaultValue: concept.description })

  return (
    <Link to={`/subjects/${subject}/${concept.id}/tasks`}>
      <Card className={`bg-white shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer h-full rounded-2xl ${
        isAdvanced ? 'ring-2 ring-orange-300 bg-orange-50/20' : ''
      }`}>
        <CardContent className="p-8 flex flex-col h-full">
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            {name}
          </h3>

          <p className="text-gray-600 mb-4 flex-1">{description}</p>

          <div className="flex flex-wrap gap-2">
            {concept.grade && (
              <Badge className="bg-blue-100 text-blue-800 rounded-lg pointer-events-none">
                {t('concepts.gradeLabel', { grade: concept.grade, defaultValue: `Grade ${concept.grade}` })}
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
